const { connectToDatabase } = require('../_lib/db');
const { verifyToken } = require('../_lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    await connectToDatabase();

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

    const { InferenceClient } = require('@huggingface/inference');
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
};
