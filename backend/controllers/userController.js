const User = require('../models/User');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({
            _id: { $ne: req.params.id }
        }).select("-password");

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};