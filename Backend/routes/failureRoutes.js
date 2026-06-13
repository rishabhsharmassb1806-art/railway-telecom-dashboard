const multer = require("multer");
const XLSX = require("xlsx");
const express = require("express");
const router = express.Router();
const Failure = require("../models/failure");
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
// UPLOAD EXCEL
router.post(
  "/upload-excel",
  upload.single("file"),
  async (req, res) => {
    try {
      const workbook = XLSX.read(
        req.file.buffer,
        { type: "buffer" }
      );

      const sheetName =
        workbook.SheetNames[0];

      const sheet =
        workbook.Sheets[sheetName];

      const data =
        XLSX.utils.sheet_to_json(sheet);

   const failures = data.map(
  (row) => ({
    title: row.Asset,
    location: row.Location,
    section: row.Section || "",
    gear: row.Gear || "",
    status: row.Status || "Open",
  })
);

      await Failure.insertMany(
        failures
      );

      res.json({
        message:
          "Excel Imported Successfully",
        count: failures.length,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Excel Upload Failed",
      });
    }
  }
);

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