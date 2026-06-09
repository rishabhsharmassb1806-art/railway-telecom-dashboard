const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");

// GET all admins

router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find();

    res.json(admins);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ADD admin

router.post("/", async (req, res) => {
  try {
    const admin = await Admin.create({
      username: req.body.username,
      password: req.body.password,
    });

    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;