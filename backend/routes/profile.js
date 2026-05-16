const express = require('express');
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');

const router = express.Router();

// Save or Update Profile
router.post('/', auth, async (req, res) => {
  try {
    const { academics, skills, interests, financial, desiredCareer } = req.body;
    
    let profile = await Profile.findOne({ userId: req.user });
    
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
      userId: req.user,
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
});

// Get Current User Profile
router.get('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user });
    if (!profile) {
      return res.status(404).json({ message: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
