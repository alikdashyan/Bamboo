const Order = require('../models/order')
const express = require('express')
const auth = require('../middleware/userAuth')
const mailTransport = require('../utils/nodemailer-setup')

const orderRouter = new express.Router()


orderRouter.post('/order', auth, async (req, res) => {
    if(!req.user.emailVerified){
        return res.send({
            error: 'Your email is not verified'
        })
    }
    const order = new Order(req.body)
    order.ID = req.user.userID
    if(!req.user.contactInfo.emailForRefunds || !req.user.contactInfo.skypeViberWhatsApp || !req.user.contactInfo.facebookLink){
        return res.status(400).send({error: "Contact info is not provided or has not filled correctly"})
    }
    order.userContactInfo = req.user.contactInfo
    try{
        await order.save()
        await req.user.populate('orders').execPopulate()
        const mailcfg = {
            to: process.env.SENDER_EMAIL_ADDRESS,
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
        }
        mailTransport.sendMail(mailcfg, function (err, info) {
            if(err){
                console.log(err)
            } else {
                console.log(info)
            }
        })
        res.status(201).send(req.user.orders)
    } catch(e) {
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

orderRouter.get('/orders', auth, async (req, res) => {
    try{
        await req.user.populate('orders').execPopulate()
        res.status(200).send(req.user.orders)
    } catch(e) {
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

module.exports = orderRouter