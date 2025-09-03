const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./Config/db');
const socketIo = require("socket.io");
const http = require('http');
const jwt = require('jsonwebtoken');


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Middleware de logging pour toutes les requêtes
app.use((req, res, next) => {
  console.log(`📡 ${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Servir les fichiers statiques
app.use('/uploads', express.static('uploads'));

// Routes
const authRoutes = require('./Routes/auth.routes');
app.use('/api/auth', authRoutes);

const userRoutes = require("./Routes/user.routes");
app.use("/api/users", userRoutes);

const adminRoutes = require("./Routes/admin.routes");
app.use("/api/admin", adminRoutes);


app.use("/api/challenges", require("./Routes/challenge.routes"));

app.use("/api/participants", require("./Routes/participant.routes"));

// Route d'upload générale
app.use("/api/upload", require("./Routes/upload.routes"));


// Routes proof directement dans server.js (temporaire)
const verifyToken = require("./Middleware/auth");
const isAdmin = require("./Middleware/isAdmin");
const Proof = require("./Models/Proof");
const Participant = require("./Models/Participant");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configuration multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads/proofs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Routes proof
app.get("/api/proofs/test", (req, res) => {
  res.json({ msg: "Routes proof fonctionnelles !" });
});

app.get("/api/proofs/my-proofs", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const proofs = await Proof.find({ user: userId })
      .populate('challenge', 'title description category')
      .populate('reviewedBy', 'username email')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      proofs,
      count: proofs.length
    });
  } catch (error) {
    console.error("❌ Erreur getMyProofs:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
});

app.post("/api/proofs/submit/:challengeId", verifyToken, upload.single('proofFile'), async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { type, description, textContent } = req.body;
    const userId = req.user.userId;

    console.log(`📝 Soumission de preuve pour le défi ${challengeId} par l'utilisateur ${userId}`);

    // Vérifier que l'utilisateur participe au défi
    const participant = await Participant.findOne({ 
      user: userId, 
      challenge: challengeId 
    });

    if (!participant) {
      return res.status(404).json({ 
        msg: "Vous devez d'abord rejoindre ce défi pour soumettre une preuve" 
      });
    }

    // Vérifier si une preuve existe déjà
    const existingProof = await Proof.findOne({ participant: participant._id });
    if (existingProof) {
      return res.status(400).json({ 
        msg: "Vous avez déjà soumis une preuve pour ce défi" 
      });
    }

    let content = '';
    let fileName = null;
    let fileSize = null;
    let mimeType = null;

    if (type === 'text') {
      content = textContent;
      if (!content || content.trim().length === 0) {
        return res.status(400).json({ msg: "Le contenu textuel est requis" });
      }
    } else {
      if (!req.file) {
        return res.status(400).json({ msg: "Fichier requis pour ce type de preuve" });
      }
      
      content = `/uploads/proofs/${req.file.filename}`;
      fileName = req.file.originalname;
      fileSize = req.file.size;
      mimeType = req.file.mimetype;
    }

    // Créer la preuve
    const proof = await Proof.create({
      participant: participant._id,
      user: userId,
      challenge: challengeId,
      type,
      content,
      description,
      fileName,
      fileSize,
      mimeType,
      status: 'en_attente'
    });

    // Mettre à jour le participant avec la preuve
    participant.proof = proof._id;
    participant.status = 'en attente';
    await participant.save();

    console.log(`✅ Preuve soumise avec succès: ${proof._id}`);

    const populatedProof = await Proof.findById(proof._id)
      .populate('user', 'username email firstName lastName')
      .populate('challenge', 'title description');

    res.status(201).json({
      msg: "Preuve soumise avec succès. Elle sera examinée par un administrateur.",
      proof: populatedProof
    });

  } catch (error) {
    console.error("❌ Erreur submitProof:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
});

app.get("/api/proofs/admin/pending", verifyToken, isAdmin, async (req, res) => {
  try {
    const proofs = await Proof.find({ status: 'en_attente' })
      .populate('user', 'username email firstName lastName profileImage')
      .populate('challenge', 'title description category')
      .populate('participant')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      proofs,
      count: proofs.length
    });
  } catch (error) {
    console.error("❌ Erreur getPendingProofs:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
});

app.put("/api/proofs/admin/:proofId/approve", verifyToken, isAdmin, async (req, res) => {
  try {
    const { proofId } = req.params;
    const { comment } = req.body;
    const adminId = req.user.userId;

    const proof = await Proof.findById(proofId)
      .populate('participant')
      .populate('user', 'username email')
      .populate('challenge', 'title');

    if (!proof) {
      return res.status(404).json({ msg: "Preuve introuvable" });
    }

    if (proof.status !== 'en_attente') {
      return res.status(400).json({ msg: "Cette preuve a déjà été traitée" });
    }

    // Mettre à jour la preuve
    proof.status = 'approuve';
    proof.reviewedBy = adminId;
    proof.reviewedAt = new Date();
    proof.reviewComment = comment || '';
    await proof.save();

    // Mettre à jour le participant
    const participant = await Participant.findById(proof.participant._id);
    if (participant) {
      participant.status = 'confirmé';
      participant.score += 100;
      await participant.save();
    }

    res.status(200).json({
      msg: "Preuve approuvée avec succès",
      proof: await Proof.findById(proofId)
        .populate('user', 'username email firstName lastName')
        .populate('challenge', 'title description')
        .populate('reviewedBy', 'username email')
    });

  } catch (error) {
    console.error("❌ Erreur approveProof:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
});

app.put("/api/proofs/admin/:proofId/reject", verifyToken, isAdmin, async (req, res) => {
  try {
    const { proofId } = req.params;
    const { comment } = req.body;
    const adminId = req.user.userId;

    const proof = await Proof.findById(proofId)
      .populate('participant')
      .populate('user', 'username email')
      .populate('challenge', 'title');

    if (!proof) {
      return res.status(404).json({ msg: "Preuve introuvable" });
    }

    if (proof.status !== 'en_attente') {
      return res.status(400).json({ msg: "Cette preuve a déjà été traitée" });
    }

    // Mettre à jour la preuve
    proof.status = 'rejete';
    proof.reviewedBy = adminId;
    proof.reviewedAt = new Date();
    proof.reviewComment = comment || '';
    await proof.save();

    // Mettre à jour le participant
    const participant = await Participant.findById(proof.participant._id);
    if (participant) {
      participant.status = 'refusé';
      await participant.save();
    }

    res.status(200).json({
      msg: "Preuve rejetée",
      proof: await Proof.findById(proofId)
        .populate('user', 'username email firstName lastName')
        .populate('challenge', 'title description')
        .populate('reviewedBy', 'username email')
    });

  } catch (error) {
    console.error("❌ Erreur rejectProof:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
});


app.use("/api/notifications", require("./Routes/notification.routes"));

app.use("/api/messages", require("./Routes/message.routes"));

app.use("/api/groups", require("./Routes/group.routes"));

const pollRoutes = require("./Routes/poll.routes");
app.use("/api/polls", pollRoutes);


const rewardCatalogRoutes = require("./Routes/rewardCatalog.routes");
app.use("/api/reward-catalog", rewardCatalogRoutes);

const userRewardRoutes = require("./Routes/userReward.routes");
app.use("/api/user-rewards", userRewardRoutes);

// Routes récompenses échangeables
app.use("/api/rewards", require("./routes/reward.routes"));

app.get('/', (req, res) => {
  res.send('🚀 API Micro-Challenges opérationnelle');
});

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  const server = http.createServer(app);

  const io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
  // rendre io accessible dans les controllers via req.app.get('io')
  app.set('io', io);

  // Carte userId -> socketId(s)
  const presence = new Map();

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
      if (!token) return next(new Error('No token'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = { userId: decoded.userId };
      next();
    } catch (e) {
      next(new Error('Auth failed'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user?.userId;
    if (userId) {
      const list = presence.get(userId) || new Set();
      list.add(socket.id);
      presence.set(userId, list);
      io.emit('presence:update', { userId, online: true });
    }

    // Rooms par groupe
    socket.on('group:join', ({ groupId }) => {
      if (!groupId) return;
      socket.join(`group:${groupId}`);
    });

    socket.on('group:leave', ({ groupId }) => {
      if (!groupId) return;
      socket.leave(`group:${groupId}`);
    });

    // Indicateur de saisie (typing)
    socket.on('typing:start', ({ groupId }) => {
      if (!groupId || !userId) return;
      socket.to(`group:${groupId}`).emit('typing:update', { groupId, userId, typing: true });
    });

    socket.on('typing:stop', ({ groupId }) => {
      if (!groupId || !userId) return;
      socket.to(`group:${groupId}`).emit('typing:update', { groupId, userId, typing: false });
    });

    socket.on('disconnect', () => {
      if (userId) {
        const list = presence.get(userId) || new Set();
        list.delete(socket.id);
        if (list.size === 0) {
          presence.delete(userId);
          io.emit('presence:update', { userId, online: false });
        } else {
          presence.set(userId, list);
        }
      }
    });
  });

  server.listen(PORT, () => {
    console.log(`🚀 Serveur + Socket.IO sur http://localhost:${PORT}`);
  });
});
