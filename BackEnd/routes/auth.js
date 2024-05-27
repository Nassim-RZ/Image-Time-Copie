const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const imageController = require('../controllers/imageController');
const verifyToken = require('../models/verifyToken');
const path = require('path');
const multer = require('multer');
const User = require('../models/user');
const Image = require('../models/image');

// Configure multer for storing images
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Serve uploaded images statically
router.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Authentication routes
router.post('/register', authController.register);

router.post('/', authController.login);

// Image and avatar related routes
router.get('/flux', imageController.getLatestImages);

router.post('/upload-avatar', [verifyToken.verify, upload.single('avatar')],authController.uploadAvatar);

router.get('/profile/:id', verifyToken.verify, authController.profile);

router.post('/uploads', [verifyToken.verify, upload.single('image')], imageController.uploadImage);

router.get('/images', verifyToken.verify, imageController.downloadImage);

router.post('/images/:imageId/like', verifyToken.verify, imageController.likeImage);

router.post('/images/:imageId/unlike', verifyToken.verify, imageController.unlikeImage);

router.get('/get-user', verifyToken.verify, authController.getUser);

router.post('/update-name', verifyToken.verify, authController.updateName);

router.post('/update-avatar', [verifyToken.verify, upload.single('avatar')], authController.updateAvatar);

router.delete('/delete-image/:imageId', verifyToken.verify, imageController.deleteImage);

router.post('/update-description/:imageId', verifyToken.verify, imageController.updateImageDescription);

module.exports = router;
