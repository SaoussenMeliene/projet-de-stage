const express = require("express");
const router = express.Router();
const notifCtrl = require("../Controllers/notification.controller");
const verifyToken = require("../Middleware/auth");

router.get("/", verifyToken, notifCtrl.getUserNotifications);
router.patch("/:id/read", verifyToken, notifCtrl.markAsRead);

module.exports = router;
