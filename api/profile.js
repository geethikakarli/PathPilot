const { connectToDatabase } = require('./_lib/db');
const { verifyToken } = require('./_lib/auth');
const Profile = require('./_lib/models/Profile');

module.exports = async function handler(req, res) {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  await connectToDatabase();

  if (req.method === 'POST') {
    try {
      const { academics, skills, interests, financial, desiredCareer } = req.body;

      let profile = await Profile.findOne({ userId });

      if (profile) {
        profile.academics = academics;
        profile.skills = skills;
        profile.interests = interests;
        profile.financial = financial;
        profile.desiredCareer = desiredCareer;
        await profile.save();
        return res.json(profile);
      }

      profile = new Profile({
        userId,
        academics,
        skills,
        interests,
        financial,
        desiredCareer
      });

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  } else if (req.method === 'GET') {
    try {
      const profile = await Profile.findOne({ userId });
      if (!profile) {
        return res.status(404).json({ message: 'There is no profile for this user' });
      }
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
