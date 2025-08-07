const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Créer les dossiers uploads s'ils n'existent pas
const uploadsDir = path.join(__dirname, "../uploads");
const profilesDir = path.join(uploadsDir, "profiles");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Différents dossiers selon le type d'upload
    if (file.fieldname === 'profileImage') {
      cb(null, profilesDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'profileImage') {
    // Pour les images de profil, accepter seulement les images
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Seules les images (JPEG, JPG, PNG, GIF, WebP) sont autorisées pour le profil"));
    }
  } else {
    // Pour les autres uploads, accepter images et vidéos
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Fichier non autorisé"));
    }
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  }
});

// Middleware spécifique pour l'image de profil
const uploadProfileImage = upload.single('profileImage');

// Wrapper pour gérer les erreurs
const handleProfileImageUpload = (req, res, next) => {
  uploadProfileImage(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          msg: 'Image trop volumineuse. Taille maximum : 5MB'
        });
      }
      return res.status(400).json({
        msg: 'Erreur lors de l\'upload : ' + err.message
      });
    } else if (err) {
      return res.status(400).json({
        msg: err.message
      });
    }
    next();
  });
};

module.exports = {
  upload,
  handleProfileImageUpload,
  uploadsDir,
  profilesDir
};
