const Order = require('../models/order')
const express = require('express')
const auth = require('../middleware/userAuth')
const sg = require('@sendgrid/mail')

const orderRouter = new express.Router()
sg.setApiKey(process.env.SENDGRID_API_KEY)

orderRouter.post('/order', auth, async (req, res) => {
    if(!req.user.emailVerified){
        return res.send({
            error: 'Your email is not verified',
            verificationLink: `${process.env.APP_URL}/users/verify?data=${token}`
        })
    }
    const order = new Order(req.body)
    order.ID = req.user.userID
    if(!req.user.contactInfo){
        return res.status(400).send({error: "Contact info is not provided"})
    }
    order.userContactInfo = req.user.contactInfo
    try{
        await order.save()
        await req.user.populate('orders').execPopulate()
        sg.send({
            to: req.user.email,
            from: process.env.SENDER_EMAIL_ADDRESS,
            subject: `${req.user.name} ${req.user.lastName} has sent an order`,
            text: `${req.user.name} ${req.user.lastName} has sent an order`,
            html: `<h1>New order from ${req.user.name} ${req.user.lastName}</h1><br>
                    <h3>Order details:</h3>
                    <ul>
                        <li>User ID: ${order.ID}</li>
                        <li>Contact Info: <ul>
                            <li>Email for refunds: ${order.userContactInfo.emailForRefunds}</li>
                            <li>Skype, Viber or WhatsApp: ${order.userContactInfo.skypeViberWhatsApp}</li>
                            <li>Facebook link: ${order.userContactInfo.facebookLink}</li>
                        </ul>
                        <li>Product link: ${order.productLink}</li>
                        <li>Buyings per day: ${order.buyingsPerDay}</li>
                        <li>Item price: ${order.itemPrice}</li>
                        <li>Total buying summary: ${order.totalBuyingSummary}</li>
                        <li>Additional info: ${order.additionalInfo}</li>
                    </ul>`
        })        
        res.status(201).send(req.user.orders)
    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }
})

orderRouter.get('/orders', auth, async (req, res) => {
    try{
        await req.user.populate('orders').execPopulate()
        res.status(200).send(req.user.orders)
    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }
})

module.exports = orderRouter