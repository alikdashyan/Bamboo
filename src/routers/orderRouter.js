const Order = require('../models/order')
const express = require('express')
const auth = require('../middleware/userAuth')
const sgMail = require('../utils/sgmail')
const request = require('request-promise')

const orderRouter = new express.Router()


orderRouter.post('/order', auth, async (req, res) => {
    if(!req.user.emailVerified){
        return res.send({
            error: 'Your email is not verified'
        })
    }
    const order = new Order(req.body.orderInfo)
    order.ID = req.user.userID
    if(!req.user.contactInfo.skypeViberWhatsApp || !req.user.contactInfo.facebookLink){
        return res.status(400).send({error: "Contact info is not provided or has not filled correctly"})
    }
    order.userContactInfo = req.user.contactInfo
    try{
        await order.save()
        const url = `https://ipay.arca.am/payment/rest/register.do?userName=${process.env.PAYMENT_LOGIN}&password=${process.env.PAYMENT_PASSWORD}&returnUrl=http://www.amzbamboo.com/order/callback&amount=${req.body.paymentInfo.amount}&orderNumber=${order._id}`
        console.log(url)
        const data = await request(url)
        if(data.errorCode){
            console.log(data)
            return res.status(400).send({error: data.errorMessage})
        }
        order.paymentId = data.orderId
        await order.save()
        res.send(data)
    } catch(e) {
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

orderRouter.get('/orders', auth, async (req, res) => {
    try{
        await req.user.populate('orders').execPopulate()
        const successOrders = req.user.orders.filter((order) => {
            return order.status === "accepted"
        })
        res.status(200).send(successOrders)
    } catch(e) {
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

orderRouter.get('/order/callback', async (req, res) => {
    try{
        const order = await Order.findOne({paymentId: req.query.orderId})
        if(!order){
            return res.status(404).send({error: "Order not found"})
        }
        const url = `https://ipay.arca.am/payment/rest/getOrderStatusExtended.do?userName=${process.env.PAYMENT_LOGIN}&password=${process.env.PAYMENT_PASSWORD}&orderNumber=${order._id}`
        console.log(url)
        const orderStatusData = JSON.parse(await request(url))
        if(orderStatusData.orderStatus === 2){
            order.status = "accepted"
            await order.save()
            // const mailcfg = {
            //     to: process.env.SENDER_EMAIL_ADDRESS,
            //     from: process.env.SENDER_EMAIL_ADDRESS,
            //     subject: `${req.user.name} ${req.user.lastName} has sent an order`,
            //     text: `${req.user.name} ${req.user.lastName} has sent an order`,
            //     html: `<h1>New order from ${req.user.name} ${req.user.lastName}</h1><br>
            //             <h3>Order details:</h3>
            //             <ul>
            //                 <li>User ID: ${order.ID}</li>
            //                 <li>Contact Info: <ul>
            //                     <li>Email for refunds: ${order.userContactInfo.emailForRefunds}</li>
            //                     <li>Skype, Viber or WhatsApp: ${order.userContactInfo.skypeViberWhatsApp}</li>
            //                     <li>Facebook link: ${order.userContactInfo.facebookLink}</li>
            //                 </ul>
            //                 <li>Product link: ${order.productLink}</li>
            //                 <li>Buyings per day: ${order.buyingsPerDay}</li>
            //                 <li>Item price: ${order.itemPrice}</li>
            //                 <li>Total buying summary: ${order.totalBuyingSummary}</li>
            //                 <li>Additional info: ${order.additionalInfo}</li>
            //             </ul>`
            // }
            // sgMail.send(mailcfg)
            res.redirect('/reportsTable')
        }
    } catch(e){
        console.log(e)
        res.status(500).send({error: e.message})
    }
    res.send()
})

module.exports = orderRouter