const User = require('../models/user');
const createHttpError = require('http-errors');
const verifyToken = require('../models/verifyToken');

// Login endpoint
exports.login = (req, res, next) => {
    const { email, password } = req.body;
    
    User.findOne({ email })
        .then(user => {
            if (!user || !user.checkPassword(password)) {
                throw createHttpError(401, 'Invalid email or password');
            }
            const accessToken = verifyToken.sign({ sub: user._id });
            res.status(200).json({
                success: true,
                data: {
                    id: user._id,
                    name: user.name,
                    accessToken,
                },
            });
        })
        .catch(next);
};

// Register endpoint
exports.register = (req, res, next) => {
    let data = { name, email, password, dateOfBirth, gender } = req.body;

    User.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                throw createHttpError(400, 'Email already exists');
            } else {
                return User.create(data);
            }
        })
        .then(user => {
            res.json(user.signJwt());
        })
        .catch(next);
};

// Profile endpoint
exports.profile = async (req, res, next) => {
    const user = await User.findById(req._id);
    res.status(200).json({
        success: true,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    });
};

// Upload avatar endpoint
exports.uploadAvatar = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req._id, { avatar: `/uploads/${req.file.originalname}` });
        res.status(200).json({
            success: true,
            data: {
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error('Error uploading avatar:', error);
        next(error);
    }
};

// Get user endpoint
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req._id);
        res.status(200).json({
            success: true,
            data: {
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error('Error getting user:', error);
        next(error);
    }
};

// Update user name endpoint
exports.updateName = async (req, res) => {
    try {
        const newName = req.body.name;
        const user = await User.findById(req._id);
        user.name = newName;
        const updatedUser = await user.save();
        res.send({ name: updatedUser.name });
    } catch (error) {
        console.error('Error updating name:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

// Update user avatar endpoint
exports.updateAvatar = async (req, res) => {
    console.log('Received request to update avatar');
    const newAvatar = req.file.path;
    const user = await User.findById(req._id);
    user.avatar = newAvatar;
    const updatedUser = await user.save();
    res.send({ avatar: updatedUser.avatar });
};
