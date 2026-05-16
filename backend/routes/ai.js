const express = require('express');
const { InferenceClient } = require('@huggingface/inference');
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');

const router = express.Router();

// Generate Dashboard Insights (Mocked AI based on profile data)
router.get('/insights', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user });

    // Fallback if profile doesn't exist (e.g., dev DB restart)
    if (!profile) {
      profile = {
        interests: 'Technology, Problem Solving',
        skills: 'Basic Computer Skills',
      };
    }

    const interestsStr = profile.interests.toLowerCase();
    const skillsStr = profile.skills.toLowerCase();

    // Very simple dynamic logic to mock AI behavior
    let careerMatch = 'Software Engineer';
    let matchScore = 88;
    if (interestsStr.includes('data') || interestsStr.includes('ai') || interestsStr.includes('machine learning')) {
      careerMatch = 'Data Scientist';
      matchScore = 94;
    } else if (interestsStr.includes('design') || interestsStr.includes('art')) {
      careerMatch = 'UI/UX Designer';
      matchScore = 91;
    } else if (interestsStr.includes('marketing') || interestsStr.includes('business')) {
      careerMatch = 'Digital Marketing Manager';
      matchScore = 89;
    }

    const missingSkills = [];
    if (!skillsStr.includes('sql') && careerMatch === 'Data Scientist') missingSkills.push({ name: 'SQL & Databases', status: 'Missing', suggestion: 'Take a comprehensive SQL bootcamp to understand relational databases.' });
    if (!skillsStr.includes('react') && careerMatch === 'Software Engineer') missingSkills.push({ name: 'React.js', status: 'Missing', suggestion: 'Build 3-4 small frontend projects using React to grasp component state.' });

    // Fill with generic skills if empty
    if (missingSkills.length === 0) {
      missingSkills.push({ name: 'Advanced Excel', status: 'Beginner', suggestion: 'Learn PivotTables and VLOOKUP functions.' });
      missingSkills.push({ name: 'Leadership', status: 'Missing', suggestion: 'Take on a project management role in your next group assignment.' });
    }

    res.json({
      careerMatch,
      matchScore,
      missingSkills,
      scholarships: [
        {
          name: 'Future Tech Innovators Grant',
          amount: '₹50,000',
          description: 'Aimed at students showing exceptional promise in technology and innovation. This grant supports tuition and project expenses.',
          deadline: 'October 15, 2026'
        },
        {
          name: 'Data Science Diversity Scholarship',
          amount: '₹1,00,000',
          description: 'Designed to support underrepresented groups in the field of Data Science and AI. Includes mentorship opportunities.',
          deadline: 'November 1, 2026'
        }
      ],
      aiMessage: `Hi there! Based on your interest in ${profile.interests.split(',')[0] || 'your field'}, I've prepared a customized roadmap for becoming a ${careerMatch}. Let's get started!`
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Real AI Chat Endpoint
router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;

    // Check if API key exists, use smart mock if missing
    if (!process.env.HUGGINGFACE_API_KEY) {
      let reply = "That's an interesting question! Since I don't have a Hugging Face API key yet, I'm running in offline mode. But keep focusing on your goals!";
      const lower = message.toLowerCase();

      if (lower.includes('hello') || lower.includes('hi')) reply = "Hello! I am your AI Mentor. How can I help you today?";
      else if (lower.includes('react') || lower.includes('frontend')) reply = "React is a great framework! I recommend building small projects to understand component state and props better.";
      else if (lower.includes('python') || lower.includes('backend')) reply = "Python is incredibly versatile. It's excellent for backend development, data science, and AI. Keep practicing!";
      else if (lower.includes('job') || lower.includes('interview')) reply = "For interviews, make sure to practice your algorithmic problem-solving and review your portfolio projects thoroughly.";
      else if (lower.includes('scholarship') || lower.includes('money')) reply = "Check out the Scholarships tab on your dashboard! I've curated a few matching opportunities for you there.";
      else if (lower.includes('roadmap')) reply = "You can view your personalized 6-month roadmap in the Learning Roadmap tab. It will guide you step-by-step.";
      else if (lower.includes('who are you')) reply = "I am PathPilot's AI Mentor, designed to guide you through your career journey!";

      return res.json({ reply });
    }

    const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

    const response = await client.chatCompletion({
      model: "Qwen/Qwen2.5-7B-Instruct",
      messages: [
        { role: "system", content: "You are a professional career mentor. Answer questions very concisely and briefly (max 2-3 sentences)." },
        { role: "user", content: message }
      ],
      max_tokens: 200
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error("AI Chat Error:", err);
    res.status(500).json({ reply: "Sorry, I'm having trouble connecting to my brain right now. Please try again later." });
  }
});

module.exports = router;
