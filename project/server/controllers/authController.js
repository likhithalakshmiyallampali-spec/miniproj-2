const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Account conflict discovered matching targeted login parameter' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'GLOBAL_EMBEDDED_SIGNING_KEY_PARAMETER', { expiresIn: '7d' });
    res.status(201).json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email, role: user.role, token }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('savedJobs');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Verification access dropped: invalid credential mappings matching arguments' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Verification access dropped: invalid credential mappings matching arguments' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'GLOBAL_EMBEDDED_SIGNING_KEY_PARAMETER', { expiresIn: '7d' });
    res.status(200).json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email, role: user.role, savedJobs: user.savedJobs, token }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProfileData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('savedJobs');
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};