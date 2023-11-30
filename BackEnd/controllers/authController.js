const User = require('../models/user');
const Image = require('../models/image');
const createHttpError = require('http-errors');
const verifyToken = require('../models/verifyToken');
const path = require('path');
const fs = require('fs');
const dir = './public/uploads';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

exports.login = (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({email}).then(user => {
        if(!user || !user.checkPassword(password)){
            throw createHttpError(401, 'Invalid email or password');
        }
        const accessToken = verifyToken.sign({ sub: user._id})
        
        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                accessToken
            }
        });
    })
    .catch(next);
}

exports.register = (req, res, next) => {
    let data = { name, email, password, dateOfBirth, gender} = req.body;
    User.create(data)
    .then(user => {
        res.json(user.signJwt());
    })
    .catch(next);
};

const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log(`Directory ${uploadDir} created successfully.`);
} else {
    console.log(`The directory ${uploadDir} already exists.`);
}

exports.profile = async (req, res, next) => {

    const user = await User.findById(req._id);
    res.status(200).json({
        success: true,
        data: {
            id: user._id,
            name: user.name,
            email: user.email, 
        }
    });
};

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
  }
  
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