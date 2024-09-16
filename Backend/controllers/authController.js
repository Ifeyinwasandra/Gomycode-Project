const authController = require('express').Router()
const User = require('../models/User')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

//register
authController.post('register', async(req, res) => {
    try {
        const isExisting = await User.findOne({email: req.body.email})
        if(isExisting){
            throw new Error("Already such an email registered")
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const newUser = await User.create({...req.body, passweord: hashedPassword})

        const {password, ...others} = newUser._doc
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '4h'})

        return res.status(201).json({others, token})
    }catch (error) {
        return res.status(500).json(error.message)
    }
});

//login

module.exports = authController