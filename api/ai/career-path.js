const { connectToDatabase } = require('../_lib/db');
const { verifyToken } = require('../_lib/auth');
const Profile = require('../_lib/models/Profile');

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
    const { career } = req.body;
    const profile = await Profile.findOne({ userId });

    let roadmap = CAREER_PATHS[career] || CAREER_PATHS["Software Engineer"]; // Fallback
    
    // If we have an API key, we can try to personalize it
    if (process.env.HUGGINGFACE_API_KEY) {
      try {
        const { InferenceClient } = require('@huggingface/inference');
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
        if (profile?.academics?.includes('CSE') && career === 'IAS Officer') {
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
};
