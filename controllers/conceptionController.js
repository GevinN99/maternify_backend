const User = require('../models/userModel');

// Get conception date
const getConceptionDate = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user || !user.pregnancyDate) {
    return res.status(404).json({ message: "Conception date not found" });
  }
  res.json({ pregnancyDate: user.pregnancyDate });
};

// Save conception date
const saveConceptionDate = async (req, res) => {
  const userId = req.user.id;
  const { pregnancyDate } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.pregnancyDate = pregnancyDate;
  await user.save();
  res.status(201).json({ pregnancyDate: user.pregnancyDate });
};

// Update conception date
const updateConceptionDate = async (req, res) => {
  console.log('running update conception')
  const userId = req.user.id;
  const { pregnancyDate } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { pregnancyDate },
    { new: true, runValidators: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ pregnancyDate: user.pregnancyDate });
};

// Delete conception date
const deleteConceptionDate = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findByIdAndUpdate(userId, { pregnancyDate: null }, { new: true });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ message: "Conception date deleted" });
};

module.exports = {
  getConceptionDate,
  saveConceptionDate,
  updateConceptionDate,
  deleteConceptionDate
};
