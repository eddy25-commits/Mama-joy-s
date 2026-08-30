const express = require("express");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Admin = require("../models/Admin");
const { protect } = require("../middleware/auth");

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// @route   POST /api/auth/login
// @desc    Admin login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide email and password");
    }

    const admin = await Admin.findOne({ where: { email: email.toLowerCase() } });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin.id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  })
);

// @route   GET /api/auth/me
// @desc    Get logged in admin profile
router.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    res.json(req.admin);
  })
);

// @route   PUT /api/auth/change-password
// @desc    Change the currently logged in admin's password
router.put(
  "/change-password",
  protect,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      res.status(400);
      throw new Error("Please provide your current password and a new password.");
    }

    if (newPassword.length < 8) {
      res.status(400);
      throw new Error("New password must be at least 8 characters long.");
    }

    if (newPassword !== confirmNewPassword) {
      res.status(400);
      throw new Error("New passwords do not match.");
    }

    const admin = await Admin.findByPk(req.admin.id);
    if (!admin) {
      res.status(404);
      throw new Error("Admin account not found.");
    }

    const isCurrentPasswordValid = await admin.matchPassword(currentPassword);
    if (!isCurrentPasswordValid) {
      res.status(401);
      throw new Error("Current password is incorrect.");
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: "Password updated successfully." });
  })
);

module.exports = router;
