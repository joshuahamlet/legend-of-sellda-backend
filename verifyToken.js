const { verify } = require("jsonwebtoken");
const User = require('./models/User')

const jwt = require('jsonwebtoken')

module.exports = async function (req, res, next) {
    const token = req.header('auth-token')
    if (!token) return res.status(401).send('Access denied')

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        const isUserAdmin = await User.findOne({_id: verified._id})
        if (!isUserAdmin.isAdmin) return res.status(400).send('Insufficient Permissions')
        req.user = verified
        next()
    } catch (err) {
        res.status(400).send('Invalid token.')
    }
} 