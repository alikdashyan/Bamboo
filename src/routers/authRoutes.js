const express = require('express')
const passport = require('passport')
const auth = require('../middleware/userAuth')

const router = new express.Router()

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}), async (req, res) => {
    res.send('Autenticating with google')
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

router.get('/viewUser', (req, res) => {
    res.send(req.user)
})

router.post('/update', async (req, res) => {
    if(!req.body.contactInfo){
        return res.status(400).send({error: 'Provided data is invalid'})
    }
    console.log(req.body)
    Object.assign(req.user, req.body)
    try{
        await req.user.save()
        res.status(200).send(req.user)
    } catch(e){
        console.log(e)
    }
})

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/auth/viewUser')
})

module.exports = router