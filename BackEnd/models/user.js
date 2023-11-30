const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const ModelSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxlength: 20
    },

    email:{
        type: String,
        required: true,
        maxlength: 40
    },

    password:{
        type: String,
        required: true,
    },

    about:{
        type: String,
        maxlength: 20
    },

    avatar: String,

    dateOfBirth: {
        day: {
            type: Number,
            required: true,
            min: 1,
            max: 31,
        },
        month: {
            type: Number,
            required: true,
            min: 1,
            max: 12,
        },
        year: {
            type: Number,
            required: true,
            min: 1900,
            max: 2023,
        },
    },

    gender: {
        type: String,
        enum: ['woman', 'man'],
        required: true,
    },
    
    images: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Image',
        }
    ],
});

ModelSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

ModelSchema.set('toJSON', {virtuals: true});

ModelSchema.methods.getData = function() {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        about: this.about,
        avatar: this.avatar,
        dateOfBirth: this.dateOfBirth,
        gender: this.gender
    };
}

ModelSchema.methods.signJwt = function() {
    let data = this.getData();
    data.token = jwt.sign(data, process.env.JWT_SECRET);
    return data;
}

ModelSchema.methods.checkPassword = function(password) {
    return this.password === password;
}


const Model = mongoose.model('User', ModelSchema);

module.exports = Model;