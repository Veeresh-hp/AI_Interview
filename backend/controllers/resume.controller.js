const Resume = require('../models/Resume.model');

exports.saveResume = async (req, res) => {
  try {
    const { userId, filename, structuredData, template, status } = req.body;

    let resume = await Resume.findOne({ filename, userId });

    if (resume) {
      resume.structuredData = structuredData;
      resume.template = template || resume.template;
      resume.status = status || resume.status;
      await resume.save();
    } else {
      resume = new Resume({
        userId,
        filename,
        structuredData,
        template: template || 'latex',
        status: status || 'draft',
        extractedText: "Generated via Builder",
      });
      await resume.save();
    }

    res.status(200).json({ message: "Resume saved", resume });
  } catch (err) {
    console.error("Save Resume Error:", err);
    res.status(500).json({ message: "Failed to save resume", error: err.message });
  }
};

exports.getResumes = async (req, res) => {
  try {
    const { userId } = req.query;
    // For now, if no userId, return all (demo mode)
    const query = userId ? { userId } : {};
    const resumes = await Resume.find(query).sort({ updatedAt: -1 });
    res.status(200).json(resumes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch resumes", error: err.message });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    await Resume.findByIdAndDelete(id);
    res.status(200).json({ message: "Resume deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete resume", error: err.message });
  }
};
