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

    // Prioritize user's desired career if set
    let careerMatch = profile.desiredCareer || 'Software Engineer';
    let matchScore = profile.desiredCareer ? 95 : 88;

    if (!profile.desiredCareer) {
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
      desiredCareer: profile.desiredCareer,
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
const CAREER_PATHS = {
  "IAS Officer": {
    overview: "The Indian Administrative Service (IAS) is the premier administrative civil service of the Government of India. It involves high-level policy making and implementation.",
    eligibility: "Any Graduation Degree. Age: 21-32 years (Relaxation for categories).",
    duration: "12-24 months preparation + 2 years training",
    salary: "₹56,100 - ₹2,50,000 per month",
    steps: [
      { title: "Graduation", duration: "3-4 years", desc: "Complete your undergraduate degree in any stream. CSE is a great background for technical logic.", tips: "Start reading newspapers (The Hindu/Express) daily." },
      { title: "Optional Subject Selection", duration: "1 month", desc: "Choose an optional subject for Mains. CSE students often pick Anthropology, Geography, or even CS if available.", tips: "Look at previous year questions before deciding." },
      { title: "UPSC Prelims Prep", duration: "6-10 months", desc: "Focus on General Studies (History, Polity, Econ) and CSAT (Aptitude).", tips: "Solve at least 50-60 mock tests." },
      { title: "UPSC Mains Strategy", duration: "4-6 months", desc: "Answer writing practice is key. Master your optional subject and Essay paper.", tips: "Focus on current affairs linkage in answers." },
      { title: "Interview / Personality Test", duration: "2 months", desc: "Prepare your DAF (Detailed Application Form) and improve communication skills.", tips: "Be honest and stay calm during the board interview." },
      { title: "LBSNAA Training", duration: "2 years", desc: "Foundation course and phase-wise training in Mussoorie.", tips: "This is where you transform into a civil servant." }
    ]
  },
  "Chartered Accountant (CA)": {
    overview: "CAs handle financial accounting, auditing, and taxation for individuals and corporations.",
    eligibility: "10+2 for Foundation, Graduation for Direct Entry.",
    duration: "4.5 - 5 years",
    salary: "₹7,00,000 - ₹25,00,000 per year",
    steps: [
      { title: "CA Foundation", duration: "6 months", desc: "Entry-level exam covering basic accounting, law, and economics.", tips: "Focus on conceptual clarity in accounts." },
      { title: "CA Intermediate", duration: "8-12 months", desc: "8 subjects across two groups. Covers advanced accounting, auditing, and taxation.", tips: "Try to clear both groups together to save time." },
      { title: "Articleship", duration: "2-3 years", desc: "Practical training under a practicing CA.", tips: "Choose a mid-size or big-4 firm for diverse exposure." },
      { title: "CA Final", duration: "6-12 months", desc: "The toughest level. Specialized knowledge in financial reporting and law.", tips: "Start preparing for finals during articleship." }
    ]
  },
  "Doctor (MBBS)": {
    overview: "Medical professionals dedicated to diagnosing and treating illnesses.",
    eligibility: "10+2 with PCB (Physics, Chemistry, Biology).",
    duration: "5.5 years (MBBS) + 3 years (MD/MS)",
    salary: "₹6,00,000 - ₹40,00,000+ per year",
    steps: [
      { title: "NEET-UG Preparation", duration: "1-2 years", desc: "Highly competitive entrance exam for medical colleges.", tips: "NCERT Biology is your bible." },
      { title: "MBBS Course", duration: "4.5 years", desc: "Academic study divided into Pre, Para, and Clinical years.", tips: "Focus on Anatomy and Physiology in the first year." },
      { title: "Compulsory Internship", duration: "1 year", desc: "Hands-on clinical training in various hospital departments.", tips: "Observe as many procedures as possible." },
      { title: "NEET-PG / NEXT", duration: "6-12 months", desc: "Entrance for specialization (MD/MS).", tips: "Decide your specialty based on your internship experience." }
    ]
  },
  "Software Engineer": {
    overview: "Design and build software systems, apps, and platforms.",
    eligibility: "B.Tech/BE/BCA/BSc in Computer Science or related fields.",
    duration: "4 years degree + continuous learning",
    salary: "₹4,00,000 - ₹50,00,000+ per year",
    steps: [
      { title: "CS Fundamentals", duration: "1-2 years", desc: "Learn Data Structures, Algorithms, OS, and Databases.", tips: "Solve problems on LeetCode or Codeforces." },
      { title: "Language Mastery", duration: "6 months", desc: "Master one backend (Java/Python/Go) or frontend (React/Vue) language.", tips: "Build 3-4 solid projects for your portfolio." },
      { title: "Internships", duration: "3-6 months", desc: "Real-world experience in a tech company.", tips: "Network with senior engineers and learn their workflow." },
      { title: "Job Hunting & Placements", duration: "3-6 months", desc: "Prepare for system design and coding interviews.", tips: "Optimize your LinkedIn and GitHub profiles." }
    ]
  },
  "Data Scientist": {
    overview: "Extract insights from complex data using statistics, machine learning, and programming.",
    eligibility: "Degree in CS, Stats, Math, or related fields.",
    duration: "1-2 years specialization",
    salary: "₹8,00,000 - ₹30,00,000 per year",
    steps: [
      { title: "Statistics & Math", duration: "4 months", desc: "Master probability, linear algebra, and hypothesis testing.", tips: "Khan Academy is great for these basics." },
      { title: "Programming (Python/R)", duration: "3 months", desc: "Learn Pandas, NumPy, and Scikit-Learn for data manipulation.", tips: "Kaggle competitions are the best way to practice." },
      { title: "Machine Learning", duration: "5 months", desc: "Understand regression, clustering, and neural networks.", tips: "Andrew Ng's courses are highly recommended." },
      { title: "Visualization & SQL", duration: "2 months", desc: "Master Tableau/PowerBI and advanced SQL queries.", tips: "Focus on storytelling with data." }
    ]
  },
  "Lawyer": {
    overview: "Advise and represent clients in legal matters, ensuring justice and compliance with laws.",
    eligibility: "LLB degree (3-year or 5-year integrated).",
    duration: "3-5 years degree + 6 months internship",
    salary: "₹5,00,000 - ₹50,00,000 per year",
    steps: [
      { title: "Entrance Exam (CLAT)", duration: "1 year", desc: "Prepare for Common Law Admission Test for top NLUs.", tips: "Focus on logical reasoning and current affairs." },
      { title: "Law School (LLB)", duration: "3-5 years", desc: "Study constitutional law, criminal law, and corporate law.", tips: "Participate in Moot Courts to build confidence." },
      { title: "Internships", duration: "Ongoing", desc: "Work with law firms, NGOs, or senior advocates.", tips: "Build a strong network early in your career." },
      { title: "Bar Council Exam", duration: "3 months", desc: "Clear the All India Bar Examination (AIBE) to practice.", tips: "Review your core subjects thoroughly." }
    ]
  },
  "Pilot": {
    overview: "Operate and navigate aircraft for commercial or private purposes.",
    eligibility: "10+2 with Physics and Math.",
    duration: "1.5 - 2 years",
    salary: "₹2,00,000 - ₹8,00,000 per month",
    steps: [
      { title: "Medical Assessment", duration: "1 month", desc: "Undergo Class 2 and Class 1 medical examinations.", tips: "Ensure you meet all physical health criteria first." },
      { title: "Ground School", duration: "6 months", desc: "Study air navigation, meteorology, and aircraft technicals.", tips: "Focus on understanding regulations and safety." },
      { title: "Flying Training (CPL)", duration: "12 months", desc: "Complete 200 hours of flying time to get Commercial Pilot License.", tips: "Consistency in flying hours is crucial." },
      { title: "Type Rating", duration: "3 months", desc: "Specialized training on a specific aircraft model like A320 or B737.", tips: "Usually sponsored by airlines after selection." }
    ]
  },
  "MBA Graduate": {
    overview: "Lead and manage business operations, strategy, and finance.",
    eligibility: "Graduation in any stream.",
    duration: "2 years",
    salary: "₹10,00,000 - ₹40,00,000 per year",
    steps: [
      { title: "Entrance Prep (CAT/GMAT)", duration: "6-12 months", desc: "Prepare for aptitude, verbal, and logical reasoning.", tips: "Mock tests are your best friend." },
      { title: "Selection Rounds", duration: "3 months", desc: "Group Discussions and Personal Interviews for B-schools.", tips: "Develop strong communication and leadership stories." },
      { title: "MBA Program", duration: "2 years", desc: "Specialize in Finance, Marketing, HR, or Operations.", tips: "Focus on case studies and networking." },
      { title: "Campus Placements", duration: "Ongoing", desc: "Secure roles in top consulting, finance, or tech firms.", tips: "Internships during MBA are a gateway to PPOs." }
    ]
  }
};

// Career Path Explorer Endpoint
router.post('/career-path', auth, async (req, res) => {
  try {
    const { career } = req.body;
    const profile = await Profile.findOne({ userId: req.user });

    let roadmap = CAREER_PATHS[career] || CAREER_PATHS["Software Engineer"]; // Fallback
    
    // If we have an API key, we can try to personalize it
    if (process.env.HUGGINGFACE_API_KEY) {
      try {
        const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);
        
        const prompt = `User Background: Studying ${profile?.academics || 'N/A'}, Skills: ${profile?.skills || 'N/A'}. 
        Target Career: ${career}.
        Provide a 5-step personalized roadmap to reach this career. 
        Format as JSON: { "personalizedNote": "brief advice", "steps": [{ "title": "...", "duration": "...", "desc": "...", "tips": "..." }] }`;

        const response = await client.chatCompletion({
          model: "Qwen/Qwen2.5-7B-Instruct",
          messages: [
            { role: "system", content: "You are a career expert. Output ONLY valid JSON." },
            { role: "user", content: prompt }
          ],
          max_tokens: 800
        });

        const aiResponse = JSON.parse(response.choices[0].message.content);
        roadmap = {
          ...roadmap,
          personalizedNote: aiResponse.personalizedNote,
          steps: aiResponse.steps || roadmap.steps
        };
      } catch (aiErr) {
        console.error("AI Personalization failed, using static path:", aiErr);
      }
    } else {
        // Simple manual personalization logic
        if (profile?.academics?.toLowerCase().includes('cse') && career === 'IAS Officer') {
            roadmap.personalizedNote = "As a CSE student, your logical reasoning is already strong. You can leverage Science & Tech as a high-scoring area in UPSC.";
        }
    }

    res.json({
      career,
      ...roadmap
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
