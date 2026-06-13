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

let allFailures = [];

for (const sheetName of workbook.SheetNames) {
  const sheet =
    workbook.Sheets[sheetName];

  const data =
    XLSX.utils.sheet_to_json(sheet);
const reportDate = new Date();

const expectedClosingDate =
  new Date();

expectedClosingDate.setDate(
  reportDate.getDate() + 4
);
  const failures = data.map(
    (row) => ({
      title:
        row.Asset ||
        row["Gear failure"] ||
        row["Main cause"] ||
        "",

      location:
        row.Location ||
        row.Station ||
        row.STN ||
        "",

      section:
        row.Section ||
        row["Sec."] ||
        "",

      gear:
  row["Gear "] ||
  row.Gear ||
  "",
 date: row.Date
  ? new Date(
      (row.Date - 25569) *
      86400 *
      1000
    )
      .toISOString()
      .split("T")[0]
  : "",
  closingDate:
  expectedClosingDate
    .toISOString()
    .split("T")[0],


      year: sheetName,

      status: "Open",
    })
  );
  
const validFailures = failures.filter(
  (failure) =>
    failure.title &&
    failure.location
);

allFailures.push(...validFailures);
}

await Failure.insertMany(allFailures);

      res.json({
        message:
          "Excel Imported Successfully",
       count: allFailures.length,
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