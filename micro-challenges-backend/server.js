const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./Config/db');
const socketIo = require("socket.io");


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Servir les fichiers statiques (images de profil)
app.use('/uploads', express.static('uploads'));

// Middleware de logging pour toutes les requêtes
app.use((req, res, next) => {
  console.log(`📡 ${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});



// Routes
const authRoutes = require('./Routes/auth.routes');
app.use('/api/auth', authRoutes);

const userRoutes = require("./Routes/user.routes");
app.use("/api/users", userRoutes);

const adminRoutes = require("./Routes/admin.routes");
app.use("/api/admin", adminRoutes);

app.use("/api/challenges", require("./Routes/challenge.routes"));

app.use("/api/participants", require("./Routes/participant.routes"));


app.use("/uploads", express.static("uploads")); // accès public aux fichiers
app.use("/api/proofs", require("./Routes/proof.routes"));


app.use("/api/notifications", require("./Routes/notification.routes"));

app.use("/api/messages", require("./Routes/message.routes"));

app.use("/api/groups", require("./Routes/group.routes"));

const pollRoutes = require("./Routes/poll.routes");
app.use("/api/polls", pollRoutes);


const rewardCatalogRoutes = require("./Routes/rewardCatalog.routes");
app.use("/api/reward-catalog", rewardCatalogRoutes);


app.get('/', (req, res) => {
  res.send('🚀 API Micro-Challenges opérationnelle');
});

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
  });
});
