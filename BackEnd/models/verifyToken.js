const jwt = require('jsonwebtoken');
const secret = 'super-secret-key'
const expiresIn = '1h'

// Generates a signed JWT
exports.sign = (payload) => jwt.sign(payload, secret, { expiresIn } )

// Middleware to verify the authenticity of JWT
exports.verify= (req, res, next) => {
    const token = req.headers['authorization']
    try{
        const payload = jwt.verify(token, secret)
        req._id = payload.sub
        next()
    }catch (e) {
        res.status(401).json({ message: 'Unauthorized!'})
    }
}


