const bcrypt = require('bcrypt');
const User = require('../models/User');

// Register
exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password required" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already taken" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            password: hashedPassword
        });

        const { password: _, ...userWithoutPassword } = newUser._doc;
        res.status(201).json(userWithoutPassword);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ error: "All fields required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const { password: _, ...userWithoutPassword } = user._doc;
        res.status(200).json(userWithoutPassword);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};