const { connectToDatabase } = require('../_lib/db');
const { verifyToken } = require('../_lib/auth');
const Profile = require('../_lib/models/Profile');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    await connectToDatabase();

    let profile = await Profile.findOne({ userId });

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
};
