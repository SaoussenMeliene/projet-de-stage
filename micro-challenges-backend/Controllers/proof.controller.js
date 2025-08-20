const Proof = require("../Models/Proof");
const Participant = require("../Models/Participant");
const Challenge = require("../Models/Challenge");
const User = require("../Models/User");
const Notification = require("../Models/Notification");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configuration multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/proofs');
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
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: function (req, file, cb) {
    // Types de fichiers autorisés
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|mp4|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'));
    }
  }
});

// Middleware d'upload
exports.uploadMiddleware = upload.single('proofFile');

// Soumettre une preuve
exports.submitProof = async (req, res) => {
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

    // Gérer le contenu selon le type
    if (type === 'text') {
      content = textContent;
      if (!content || content.trim().length === 0) {
        return res.status(400).json({ msg: "Le contenu textuel est requis" });
      }
    } else {
      // Pour les fichiers (image, video, file)
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
    participant.status = 'en attente'; // Remettre en attente jusqu'à validation
    await participant.save();

    console.log(`✅ Preuve soumise avec succès: ${proof._id}`);

    // Populer les données pour la réponse
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
};

// Obtenir les preuves en attente (Admin)
exports.getPendingProofs = async (req, res) => {
  try {
    console.log(`🔍 Récupération des preuves en attente`);

    const proofs = await Proof.find({ status: 'en_attente' })
      .populate('user', 'username email firstName lastName profileImage')
      .populate('challenge', 'title description category')
      .populate('participant')
      .sort({ submittedAt: -1 });

    console.log(`📊 ${proofs.length} preuves en attente trouvées`);

    res.status(200).json({
      proofs,
      count: proofs.length
    });

  } catch (error) {
    console.error("❌ Erreur getPendingProofs:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};

// Obtenir toutes les preuves avec filtres (Admin)
exports.getAllProofs = async (req, res) => {
  try {
    const { status, challengeId, userId, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (challengeId) filter.challenge = challengeId;
    if (userId) filter.user = userId;

    const skip = (page - 1) * limit;

    console.log(`🔍 Récupération des preuves avec filtres:`, filter);

    const proofs = await Proof.find(filter)
      .populate('user', 'username email firstName lastName profileImage')
      .populate('challenge', 'title description category')
      .populate('reviewedBy', 'username email')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Proof.countDocuments(filter);

    console.log(`📊 ${proofs.length}/${total} preuves récupérées`);

    res.status(200).json({
      proofs,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: proofs.length,
        totalItems: total
      }
    });

  } catch (error) {
    console.error("❌ Erreur getAllProofs:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};

// Approuver une preuve (Admin)
exports.approveProof = async (req, res) => {
  try {
    const { proofId } = req.params;
    const { comment } = req.body;
    const adminId = req.user.userId;

    console.log(`✅ Approbation de la preuve ${proofId} par l'admin ${adminId}`);

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
      participant.score += 100; // Points bonus pour validation
      await participant.save();
    }

    console.log(`✅ Preuve approuvée: ${proof.user.username} pour "${proof.challenge.title}"`);

    // Créer une notification pour l'utilisateur
    await Notification.create({
      user: proof.user._id,
      title: "Preuve approuvée !",
      message: `Votre preuve pour le défi "${proof.challenge.title}" a été approuvée. Félicitations !`
    });

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
};

// Rejeter une preuve (Admin)
exports.rejectProof = async (req, res) => {
  try {
    const { proofId } = req.params;
    const { comment } = req.body;
    const adminId = req.user.userId;

    console.log(`❌ Rejet de la preuve ${proofId} par l'admin ${adminId}`);

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

    console.log(`❌ Preuve rejetée: ${proof.user.username} pour "${proof.challenge.title}"`);

    // Créer une notification pour l'utilisateur
    await Notification.create({
      user: proof.user._id,
      title: "Preuve rejetée",
      message: `Votre preuve pour le défi "${proof.challenge.title}" a été rejetée. ${comment ? 'Commentaire: ' + comment : 'Vous pouvez soumettre une nouvelle preuve.'}`
    });

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
};

// Obtenir mes preuves (Utilisateur)
exports.getMyProofs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { challengeId } = req.query;

    console.log(`🔍 Récupération des preuves de l'utilisateur ${userId}${challengeId ? ` pour le défi ${challengeId}` : ''}`);

    const filter = { user: userId };
    if (challengeId) {
      filter.challenge = challengeId;
    }

    const proofs = await Proof.find(filter)
      .populate('challenge', 'title description category')
      .populate('reviewedBy', 'username email')
      .sort({ submittedAt: -1 });

    console.log(`📊 ${proofs.length} preuves trouvées pour l'utilisateur`);

    res.status(200).json({
      proofs,
      count: proofs.length
    });

  } catch (error) {
    console.error("❌ Erreur getMyProofs:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};

// Obtenir une preuve spécifique
exports.getProofById = async (req, res) => {
  try {
    const { proofId } = req.params;

    const proof = await Proof.findById(proofId)
      .populate('user', 'username email firstName lastName profileImage')
      .populate('challenge', 'title description category')
      .populate('reviewedBy', 'username email')
      .populate('participant');

    if (!proof) {
      return res.status(404).json({ msg: "Preuve introuvable" });
    }

    res.status(200).json({ proof });

  } catch (error) {
    console.error("❌ Erreur getProofById:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};