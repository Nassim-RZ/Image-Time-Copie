const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const verifyToken = require('../models/verifyToken');
const path = require('path');
const multer = require('multer');
const User = require('../models/user');
const Image = require('../models/image');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });




router.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

router.post('/register', controller.register);

router.post('/', controller.login);

router.get('/flux',  controller.getLatestImages);

router.post('/upload-avatar', [verifyToken.verify, upload.single('avatar')], controller.uploadAvatar);

router.get('/profile/:id', verifyToken.verify, controller.profile);

router.post('/uploads', [verifyToken.verify, upload.single('image')], (req, res, next) => {
    controller.uploadImage(req, res, next);
});

router.get('/images', verifyToken.verify, controller.downloadImage);


router.post('/images/:imageId/like', verifyToken.verify, controller.likeImage);

router.get('/get-user', verifyToken.verify, controller.getUser);

router.post('/update-name', verifyToken.verify, async (req, res) => {
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
});

router.post('/update-avatar', [verifyToken.verify, upload.single('avatar')], async (req, res) => {
  console.log('Received request to update avatar');
  const newAvatar = req.file.path;
  const user = await User.findById(req._id);
  user.avatar = newAvatar;
  const updatedUser = await user.save();
  res.send({ avatar: updatedUser.avatar });
});

const deleteImage = async (req, res) => {
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

router.delete('/delete-image/:imageId', verifyToken.verify, deleteImage);

module.exports = router;