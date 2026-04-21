const fs = require('fs');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume.model');

exports.uploadResume = async (req, res) => {
  console.log("Upload request received");
  try {
    if (!req.file) {
      console.warn("No file in request");
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { userId } = req.body; 
    const file = req.file;
    console.log(`Processing file: ${file.originalname}, size: ${file.size}, type: ${file.mimetype}`);
    
    let extractedText = "";

    if (file.mimetype === 'application/pdf') {
      console.log("Parsing PDF...");
      const dataBuffer = fs.readFileSync(file.path);
      const data = await pdfParse(dataBuffer);
      extractedText = data.text;
      console.log("PDF parsing successful");
    } else if (file.mimetype === 'text/plain') {
      extractedText = fs.readFileSync(file.path, 'utf8');
    } else {
      console.warn(`Unsupported type: ${file.mimetype}`);
      return res.status(400).json({ message: "Unsupported file format. Please upload PDF or TXT." });
    }

    // Attempt to delete the temp file
    try {
      fs.unlinkSync(file.path);
    } catch (unlinkErr) {
      console.warn("Could not delete temp file:", unlinkErr.message);
    }

    console.log("Saving to database...");
    const newResume = new Resume({
      userId: userId && userId !== "" ? userId : undefined,
      filename: file.originalname,
      extractedText
    });

    await newResume.save();
    console.log("Database save successful");

    res.json({ message: "Resume uploaded successfully", resumeId: newResume._id, extractedText });
  } catch (err) {
    console.error("CRITICAL UPLOAD ERROR:", err);
    res.status(500).json({ message: "Failed to process resume", error: err.message });
  }
};
