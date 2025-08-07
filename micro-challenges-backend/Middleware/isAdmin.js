const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // autorisé
  } else {
    return res.status(403).json({ msg: "Accès refusé : admin uniquement." });
  }
};

module.exports = isAdmin;
