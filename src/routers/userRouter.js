const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/userAuth')
const jwt = require('jsonwebtoken')
const sg = require('@sendgrid/mail')
const path = require('path')
const generateUniqueString = require('../utils/generateUniqueString')
const Order = require('../models/order')

const userRouter = new express.Router()
sg.setApiKey(process.env.SENDGRID_API_KEY)

userRouter.post('/signup', async (req, res) => {
    const user = new User(req.body)
    user.userID = await generateUniqueString()
    try{
        await user.save()
        const token = await user.generateAuthToken()
        const mailVerifyToken = jwt.sign({id: user._id.toString()}, process.env.PASSWORD_TOKEN_KEY)
        const url = `${process.env.APP_URL}/users/verify?data=${mailVerifyToken}`
        sg.send({
            to: user.email,
            from: process.env.SENDER_EMAIL_ADDRESS,
            subject: `Bamboo.am Email Verification`,
            text: 'Please verify your email by following this link',
            html: `<h2>Dear ${user.name} ${user.lastName}. Welcome to bamboo.am. Please verify your email.</h2>
                    <a href="${url}">Follow this link</a>`
        })
        res.status(201).send({user, token})
    } catch(e) {
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

userRouter.post('/admin', auth, async (req, res) => {
    if(!req.body.adminCode || (req.body.newKind !== 'admin' && req.body.newKind !== 'customer')){
        return res.status(400).send({error: 'Invalid request'})
    }
    if(req.body.adminCode === process.env.ADMIN_CODE){
        req.user.kind = req.body.newKind
        await req.user.save()
        return res.status(200).send({message: 'Now your account type is Administrator'})
    }
    res.status(400).send({error: 'Admin code is invalid'})
})

userRouter.get('/verify', async (req, res) => {
    const token = req.query.data
    if(!token){
        return res.status(400).send({error: "Invalid request"})
    }
    try{
        const payload = jwt.verify(token, process.env.PASSWORD_TOKEN_KEY)
        const user = await User.findOne({_id: payload.id})
        if(!user){
            return res.status(404).send({error: 'User not found'})
        }
        user.emailVerified = true
        await user.save()
        res.redirect('/')
    } catch(e){
        console.log(e)
        res.status(400).send({error: e.message})
    }
})

userRouter.post('/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if(!user){
            return res.status(404).send({error: 'User not found'})
        }
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e){
        res.status(401).send({error: e.message})
    }
})

userRouter.post('/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {return token.token !== req.token})
        await req.user.save()
        res.send()
    } catch(e){
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

userRouter.post('/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch(e) {
        res.status(500).send({error: e.message})
    }
})

userRouter.patch('/update', auth, async (req, res) => {
    try{
        if(!(req.body.name || req.body.lastName || req.body.email || req.body.password)) {
            return res.status(400).send({message: 'Provided data is invalid. Nothing changed'})
        }
        Object.assign(req.user, req.body)
        await req.user.save()
        res.status(200).send()
    } catch (e){
        res.status(500).send({error: e.message})
    }
})

userRouter.post('/recovery', async (req, res) => {
    if(!req.body.email){
        return res.status(400).send({error: 'Invalid request'})
    }
    try{
        const user = await User.findOne({email: req.body.email})
        if(!user){
            return res.status(404).send({error: "User not found"})
        }
        const token = jwt.sign({id: user._id.toString(), date: Date.now()}, process.env.PASSWORD_TOKEN_KEY)
        const url = `${process.env.APP_URL}/users/recovery/callback?token=${token}`
        if(!user.emailVerified){
            return res.send({
                error: 'Your email is not verified',
                verificationLink: `${process.env.APP_URL}/users/verify?data=${token}`
            })
        }
        sg.send({
            from: process.env.SENDER_EMAIL_ADDRESS,
            to: user.email,
            subject: "Bamboo password recovery",
            text: "Password recovery link for Bamboo",
            html: `<a href="${url}">Follow this link for password recovery</a>`
        })
        res.status(200).send(url)
    } catch(e){
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

userRouter.get('/recovery/callback', async (req, res) => {
    try{
        if(!req.query.token){
            return res.status(400).send({error: 'Invalid request'})
        }
        const token = req.query.token
        const payload = jwt.verify(token, process.env.PASSWORD_TOKEN_KEY)
        const user = await User.findOne({_id: payload.id})
        if(!user){
            return res.status(404).send({error: "User not found"})
        }
        const newDate = Date.now()
        if((newDate-payload.date)>900000){
            return res.send("Your token is expired.")
        }
        user.passwordChange = true
        await user.save()
        res.sendFile(path.join(__dirname, './password.html'))
    } catch(e){
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

userRouter.post('/changePassword', async (req, res) => {
    try{
        if(!req.body.newPass || !req.body.paswdToken){
            return res.status(400).send({error: 'Invalid data'})
        }
        const payload = jwt.verify(req.body.paswdToken, process.env.PASSWORD_TOKEN_KEY)
        const newDate = Date.now()
        if((newDate-payload.date)>900000){
            return res.send("Your token is expired.")
        }
        const user = await User.findOne({_id: payload.id})
        if(!user){
            return res.status(404).send({error: 'User not found'})
        }
        if(!user.passwordChange){
            return res.status(400).send({error: "Invalid request"})
        }
        user.password = req.body.newPass
        user.passwordChange = false
        await user.save()
        console.log('Password changed')
        return res.send("Password changed")
    } catch(e){
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

userRouter.get('/me', auth, (req, res) => {
    res.send(req.user)
})

userRouter.delete('/me', auth, async (req, res) => {
    try{
        await req.user.remove()
        res.status(200).send()
        await Order.deleteMany({ID: req.user.userID})
    } catch(e) {
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

module.exports = userRouter