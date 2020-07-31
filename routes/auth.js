const router = require('express').Router()
const User = require('../models/User')
const {registerValidation, loginValidation} = require('../validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


router.post('/register', async (req,res) => {

    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const doesEmailExist = await User.findOne({email: req.body.email})
    if (doesEmailExist) return res.status(400).send('Email already exists.')

    const salt = await bcrypt.genSalt(10)
    const hashedPW = await bcrypt.hash(req.body.password, salt)


    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPW
    })
    try{
        const savedUser = await user.save()
        const token = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET)
        res.header('auth-token', token).send({
        name: user.name,
        email: user.email,
        token: token
    })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/login', async (req,res) => {

    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findOne({email: req.body.email})
    if (!user) return res.status(400).send('User not found.')

    const validPW = await bcrypt.compare(req.body.password, user.password)
    if (!validPW) return res.status(400).send('Invalid password.')

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send({
        name: user.name,
        email: user.email,
        token: token
    })

})

module.exports = router