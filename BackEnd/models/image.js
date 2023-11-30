const mongoose = require('mongoose');

const ModelSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: false,
    },

    date: {
        type: Date,
        required: true,
    },

    likes: {
        type: Number,
        default: 0,
    },

    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Model = mongoose.model('Image', ModelSchema);

module.exports = Model;