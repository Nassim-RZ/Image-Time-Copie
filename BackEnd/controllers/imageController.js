const User = require('../models/user');
const Image = require('../models/image');
const path = require('path');
const fs = require('fs');
const dir = './public/uploads';

// Ensure the 'uploads' directory exists
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const uploadDir = 'public/uploads';

// Ensure the 'uploads' directory exists and log the status
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log(`Directory ${uploadDir} created successfully.`);
} else {
    console.log(`The directory ${uploadDir} already exists.`);
}

// Upload image endpoint
exports.uploadImage = async (req, res, next) => {
    try {
        const user = await User.findById(req._id);
        const image = await Image.create({
            image: `/uploads/${req.file.originalname}`,
            description: req.body.description,
            date: new Date(),
            userId: user._id,
        });
        user.images.push(image._id);
        await user.save();

        res.status(200).json({
            success: true,
            data: {
                imageId: image._id,
                imageUrl: `/uploads/${req.file.originalname}`,
            },
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        next(error);
    }
};

// Download images endpoint
exports.downloadImage = async (req, res, next) => {
    try {
        const user = await User.findById(req._id).populate('images');
        const images = user.images.map(image => ({
            _id: image._id,
            image: `${image.image}`,
            description: image.description,
        }));
        res.status(200).json({
            success: true,
            data: {
                images,
            },
        });
    } catch (error) {
        console.error('Error fetching images:', error);
        next(error);
    }
};

// Get the latest images endpoint
exports.getLatestImages = async (req, res) => {
    try {
        const users = await User.find().populate({
            path: 'images',
            options: { sort: { date: -1 }, limit: 1 },
        });

        const images = users.map(user => ({
            userId: user._id,
            userName: user.name,
            latestImage: user.images[0],
        }));
        res.json({ data: { images } });
    } catch (error) {
        console.error('Error fetching latest images:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Like image endpoint
exports.likeImage = async (req, res, next) => {
    const { imageId } = req.params;
    const userId = req._id;

    try {
        const image = await Image.findById(imageId);
        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        if (!image.likedBy.includes(userId)) {
            image.likedBy.push(userId);
            image.likes = image.likedBy.length;
            await image.save();

            res.json({ success: true, message: 'Image liked successfully', updatedLikes: image.likes });
        } else {
            res.json({ success: false, message: 'User already liked this image' });
        }
    } catch (error) {
        console.error('Error liking image:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Unlike image endpoint
exports.unlikeImage = async (req, res, next) => {
    const { imageId } = req.params;
    const userId = req._id;

    try {
        const image = await Image.findById(imageId);
        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        if (image.likedBy.includes(userId)) {
            const index = image.likedBy.indexOf(userId);
            if (index > -1) {
                image.likedBy.splice(index, 1);
            }
            image.likes = image.likedBy.length;
            await image.save();

            res.json({ success: true, message: 'Image unliked successfully', updatedLikes: image.likes });
        } else {
            res.json({ success: false, message: 'User has not liked this image yet' });
        }
    } catch (error) {
        console.error('Error unliking image:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete image endpoint
exports.deleteImage = async (req, res) => {
    const imageId = req.params.imageId;

    try {
        const deletedImage = await Image.findByIdAndDelete(imageId);

        if (!deletedImage) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        res.status(200).json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Update image description endpoint
exports.updateImageDescription = async (req, res, next) => {
    const { imageId } = req.params;
    const { description } = req.body;

    try {
        const userId = req._id;
        const image = await Image.findOne({ _id: imageId, userId });

        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found or not owned by the user.' });
        }

        image.description = description;
        await image.save();

        res.json({ success: true, message: 'Image description updated successfully.' });
    } catch (error) {
        console.error('Error updating image description:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
