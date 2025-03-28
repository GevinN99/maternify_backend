const User = require('../models/userModel');
const { hashPassword, comparePassword, generateToken } = require('../middlewares/auth');

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            role,
            languagePreference,
            profileImage,
            homeLocation,
            pregnancyDate,
            partnerDetails,
            age,
            parentingDay,
            weight
        } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role: role || "mother",
            languagePreference: languagePreference || "English",
            profileImage: profileImage || "https://www.w3schools.com/w3images/avatar2.png",
            homeLocation: homeLocation || null,
            pregnancyDate: pregnancyDate ? new Date(pregnancyDate) : null,
            partnerDetails: partnerDetails || null,
            age: age || null,
            parentingDay: parentingDay ? new Date(parentingDay) : null,
            weight: weight || null
        });

        await newUser.save();

        const token = generateToken(newUser);
        res.status(201).json({ token, userId: newUser._id, role: newUser.role });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Login an existing user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = await comparePassword(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        res.status(200).json({ token, userId: user._id, role: user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getUserProfileById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('healthHistory fullName');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, languagePreference } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            req.body,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete user (Admin or self)
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Change user password
exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await comparePassword(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

        const hashedNewPassword = await hashPassword(newPassword);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};