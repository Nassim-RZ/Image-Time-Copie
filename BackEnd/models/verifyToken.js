const jwt = require('jsonwebtoken');
const secret = 'super-secret-key'
const expiresIn = '1h'

exports.sign = (payload) => jwt.sign(payload, secret, { expiresIn } )

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


