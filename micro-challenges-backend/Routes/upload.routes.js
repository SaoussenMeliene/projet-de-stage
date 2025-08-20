const express = require('express');
const router = express.Router();
const { upload } = require('../Middleware/upload');
const path = require('path');

// Route pour upload d'image générale
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Aucun fichier fourni' });
    }

    // Construire l'URL du fichier
    const filename = req.file.filename;
    const url = `/uploads/${filename}`;

    res.json({
      msg: 'Fichier uploadé avec succès',
      filename: filename,
      url: url,
      originalName: req.file.originalname,
      size: req.file.size
    });

  } catch (error) {
    console.error('Erreur upload:', error);
    res.status(500).json({ msg: 'Erreur serveur lors de l\'upload' });
  }
});

// Middleware de gestion d'erreurs pour multer
router.use((error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      msg: 'Fichier trop volumineux. Taille maximum : 5MB'
    });
  }
  
  if (error.message) {
    return res.status(400).json({
      msg: error.message
    });
  }
  
  res.status(500).json({ msg: 'Erreur serveur' });
});

module.exports = router;