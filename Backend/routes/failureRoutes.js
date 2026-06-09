const express = require("express");
const router = express.Router();
const Failure = require("../models/failure");

// GET all failures
router.get("/", async (req, res) => {
  try {
    const failures = await Failure.find();
    res.json(failures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// UPDATE STATUS

router.put("/:id", async (req, res) => {
  try {
    const failure = await Failure.findById(req.params.id);

    if (!failure) {
      return res
        .status(404)
        .json({ message: "Failure Not Found" });
    }

    let nextStatus = "Open";

    if (failure.status === "Open")
      nextStatus = "In Progress";
    else if (failure.status === "In Progress")
      nextStatus = "Resolved";
    else if (failure.status === "Resolved")
      nextStatus = "Open";

    failure.status = nextStatus;

    await failure.save();

    res.json(failure);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ADD failure
router.post("/", async (req, res) => {
  try {
    const failure = new Failure(req.body);
    const savedFailure = await failure.save();
    res.status(201).json(savedFailure);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE failure
router.delete("/:id", async (req, res) => {
  try {
     console.log(req.params.id);
    await Failure.findByIdAndDelete(req.params.id);
    res.json({ message: "Failure Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;