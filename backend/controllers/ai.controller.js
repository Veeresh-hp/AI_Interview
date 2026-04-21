const OpenAI = require('openai');
const Interview = require('../models/Interview.model');

// Using Groq's OpenAI-compatible API
const openai = new OpenAI({ 
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

exports.generateQuestions = async (req, res) => {
  try {
    const { mode, difficulty, jobDescription, resumeText, questionsCount } = req.body;
    const count = questionsCount || 3;
    
    let prompt = `You are an expert technical interviewer at a top-tier tech company. 
    Your goal is to generate ${count} unique, high-quality interview questions for a candidate.
    
    Difficulty Level: ${difficulty}
    Interview Mode: ${mode}
    
    Context:
    ${resumeText ? `Candidate Resume: ${resumeText}` : ''}
    ${jobDescription ? `Job Description: ${jobDescription}` : ''}
    
    Instructions:
    1. If a Resume is provided, ask at least one question specifically about the candidate's projects or experience.
    2. If a Job Description is provided, ask questions that relate directly to the requirements listed.
    3. Ensure questions are challenging according to the ${difficulty} level.
    4. Provide your response EXACTLY as a JSON array of strings. 
    Do NOT include any introduction, explanations, or markdown formatting.
    
    Example format for ${count} questions: [${Array(count).fill(0).map((_, i) => `"Question ${i+1}"`).join(", ")}]`;


    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    const questionsMsg = completion.choices[0].message.content;
    let questionsResponse = questionsMsg.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const jsonParsed = JSON.parse(questionsResponse);
      res.json({ questions: jsonParsed });
    } catch (parseErr) {
      console.error("JSON Parse Error:", questionsMsg);
      res.status(500).json({ message: "AI response was not in valid JSON format", raw: questionsMsg });
    }
  } catch(err) {
    console.error("Groq/AI Error (Gen Qs):", err);
    res.status(500).json({ message: "Failed to generate AI questions.", error: String(err) });
  }
};

exports.evaluateAnswers = async (req, res) => {
  try {
    const { qna, difficulty, resumeId, mode } = req.body;
    
    let prompt = `You are evaluating an interview candidate. The difficulty was ${difficulty}.\n`;
    prompt += `Review their questions and answers:\n---\n`;
    qna.forEach((qa, idx) => {
      prompt += `Q${idx+1}: ${qa.question}\n`;
      prompt += `A${idx+1}: ${qa.answer}\n\n`;
    });
    prompt += `Evaluate each answer.\nProvide your response exactly in JSON format, without any markdown blocks or intro text:
{
  "totalScore": <number 0-100 indicating overall performance>,
  "generalFeedback": "<overall brief summary of performance>",
  "evaluations": [
      { "feedback": "<specific feedback for answer 1>", "score": <0-10 score> }
  ]
}`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a specialized JSON-only evaluation assistant. Output only raw JSON." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
    });

    const evalMsg = completion.choices[0].message.content;
    let evalResponse = evalMsg.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const jsonParsed = JSON.parse(evalResponse);
      
      const interviewRecord = new Interview({
        userId: undefined,
        resumeId: resumeId || undefined,
        difficulty: difficulty || 'Medium',
        mode: mode || 'Resume + JD',
        score: jsonParsed.totalScore,
        generalFeedback: jsonParsed.generalFeedback,
        qna: qna.map((item, idx) => ({
          question: item.question,
          answer: item.answer,
          feedback: jsonParsed.evaluations[idx]?.feedback,
          score: jsonParsed.evaluations[idx]?.score
        }))
      });
      
      await interviewRecord.save();
      res.json({ ...jsonParsed, interviewId: interviewRecord._id });
    } catch (parseErr) {
      console.error("JSON Parse Error (Eval):", evalMsg);
      res.status(500).json({ message: "AI evaluation response format invalid", raw: evalMsg });
    }
  } catch(err) {
    console.error("OpenAI Error (Eval):", err);
    res.status(500).json({ message: "Failed to evaluate answers", error: String(err) });
  }
};

exports.getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().sort({ createdAt: -1 });
    res.json(interviews);
  } catch (err) {
    console.error("DB Error (Get Interviews):", err);
    res.status(500).json({ message: "Failed to fetch interview history" });
  }
};

exports.getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: "Interview not found" });
    res.json(interview);
  } catch (err) {
    console.error("DB Error (Get Interview By ID):", err);
    res.status(500).json({ message: "Failed to fetch interview report" });
  }
};
