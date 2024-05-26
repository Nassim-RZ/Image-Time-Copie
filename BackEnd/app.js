require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const createError = require('http-errors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const cors = require('cors');

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(cors({
    origin: 'https://image-time.onrender.com/' // Remplacez par votre domaine
}));

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', require('./routes/auth'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((err, req, res, next) => {
    if(req.get('accept').includes('json')){
        return next(createError(404));
    }
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
    
});

app.use((err, req, res, next) => {
    if(err.name === 'MongoError' || err.name === 'ValidationError' || err.name === 'CastError'){
        err.status= 422;
    }
    res.status(err.status || 500).json({message: err.message || 'some error eccured.'});
    
});

app.post('/logout', (req, res) => {
    res.json({ message: 'Logout successful' });
});

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true })
    .then(() => {
        console.log('Connected successfully');
    })
    .catch(err => {
        console.error('Connection error:', err.message);
    });

module.exports = app;
