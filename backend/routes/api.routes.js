const express = require('express');
const router = express.Router();
const multer = require('multer');

// Standard disk storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });

const authController = require('../controllers/auth.controller');
const uploadController = require('../controllers/upload.controller');
const aiController = require('../controllers/ai.controller');
const resumeController = require('../controllers/resume.controller');

router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);

router.post('/upload/resume', upload.single('resume'), uploadController.uploadResume);

router.post('/ai/generate-questions', aiController.generateQuestions);
router.post('/ai/evaluate-answers', aiController.evaluateAnswers);
router.get('/interviews', aiController.getInterviews);
router.get('/interviews/:id', aiController.getInterviewById);

router.post('/resumes', resumeController.saveResume);
router.get('/resumes', resumeController.getResumes);
router.delete('/resumes/:id', resumeController.deleteResume);



module.exports = router;
