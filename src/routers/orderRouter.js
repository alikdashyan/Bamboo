const Order = require('../models/order');
const express = require('express');
const auth = require('../middleware/userAuth');
const sgMail = require('../utils/sgmail');
const request = require('request-promise');
const User = require('../models/user');
const grs = require('randomstring');
const orderRouter = new express.Router();


orderRouter.post('/order', auth, async (req, res) => {
    if (!req.user.emailVerified) {
        return res.status(400).send({ error: 'Your email is not verified' });
    }
    try {
        const order = new Order(req.body.orderInfo);
        order.ID = req.user.userID;
        order.userContactInfo = req.user.contactInfo;
        order.orderId = grs.generate({
            length: 6,
            charset: 'alphanumeric'
        })
        await order.save();
        res.send(order);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});

orderRouter.post('/payOrder', auth, async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.body.orderId });
        const orderNumber = grs.generate({
            length: 25,
            charset: 'alphanumeric'
        });
        if (!order) {
            return res.status(404).send({ error: "Order not found" })
        }
        if (!order.readyForPayment) {
            return res.status(400).send({ error: "Order is not ready for payment" });
        }
        const url = `https://ipay.arca.am/payment/rest/register.do?userName=${process.env.PAYMENT_LOGIN}&password=${process.env.PAYMENT_PASSWORD}&returnUrl=http://www.amzbamboo.com/order/callback&amount=${order.price * 100}&orderNumber=${orderNumber}&currency=840&description=Product link: ${order.productLink}`;
        const data = await request(url);
        if (data.errorCode) {
            return res.status(400).send({ error: data.errorMessage });
        }
        console.log("Response data: " + data);
        res.send(data);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
})

orderRouter.get('/successOrders', auth, async (req, res) => {
    try {
        await req.user.populate('orders').execPopulate();
        const successOrders = req.user.orders.filter((order) => {
            return order.status === "accepted";
        });
        res.status(200).send(successOrders);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});

orderRouter.get('/orders', auth, async (req, res) => {
    try {
        await req.user.populate('orders').execPopulate();
        res.send(req.user.orders);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
})

orderRouter.get('/allOrders', auth, async (req, res) => {
    if (req.user.kind !== "admin" && req.user.kind !== "worker") {
        return res.status(400).send({ error: "You dont have admin privileges" });
    };
    try {
        const allOrders = await Order.find({});
        res.send(allOrders);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});

orderRouter.post('/setOrderPrice', auth, async (req, res) => {
    if (req.user.kind.toLowerCase() !== 'worker') {
        return res.status(400).send({ error: "Access denied!" })
    };
    try {
        const order = await Order.findOne({ orderId: req.body.orderId });
        if (!order) {
            return res.status(404).send({ error: "Order not found" });
        };
        order.price = req.body.price;
        order.readyForPayment = true;
        await order.save();
        res.send(order);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
})

orderRouter.get('/order/callback', async (req, res) => {
    try {
        const orderID = req.query.orderId;
        const url = `https://ipay.arca.am/payment/rest/getOrderStatusExtended.do?userName=${process.env.PAYMENT_LOGIN}&password=${process.env.PAYMENT_PASSWORD}&orderId=${orderID}`;
        const orderStatusData = JSON.parse(await request(url));

        if (orderStatusData.orderStatus === 2) {
            const order = await Order.findOne({ _id: orderStatusData.orderNumber });
            if (!order) {
                return res.status(404).send({ error: "Order not found" })
            };
            const user = await User.findOne({ userID: order.ID });
            if (!user) {
                return res.status(404).send({ error: "Order owner is not found" })
            };
            order.status = "accepted";
            await order.save();
            const mailcfg = {
                to: process.env.SENDER_EMAIL_ADDRESS,
                from: process.env.SENDER_EMAIL_ADDRESS,
                subject: `${user.name} ${user.lastName} has sent an order`,
                text: `${user.name} ${user.lastName} has sent an order`,
                html: `<h1>New order from ${user.name} ${user.lastName}</h1><br>
                        <h3>Order details:</h3>
                        <ul>
                            <li>User ID: ${order.ID}</li>
                            <li>Contact Info: <ul>
                                <li>Email for refunds: ${order.emailForRefunds}</li>
                                <li>Skype, Viber or WhatsApp: ${order.userContactInfo.skypeViberWhatsApp}</li>
                                <li>Facebook link: ${order.userContactInfo.facebookLink}</li>
                            </ul>
                            <li>Product link: ${order.productLink}</li>
                            <li>Service Type: $${order.serviceType}</li>
                            <li>Buyings per day: ${order.buyingsPerDay}</li>
                            <li>Item price: ${order.itemPrice}</li>
                            <li>Total buying summary: ${order.totalBuyingSummary}</li>
                            <li>Additional info: ${order.additionalInfo}</li>
                        </ul>`
            };
            sgMail.send(mailcfg);
            return res.redirect('/#/userTable');
        }
        return res.redirect('/#/paymentError');
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
    res.send();
});

orderRouter.post('/changeOrderStatus', auth, async (req, res) => {
    try {
        if (req.user.kind !== "admin" && req.user.kind !== "worker") {
            return res.status(400).send({ error: "You dont have admin privileges" });
        };
        const order = await Order.findOne({ orderId: req.body.orderId });
        if (!order) {
            return res.status(404).send({ error: "Order not found" });
        }
        order.status = 'success';
        await order.save();
        res.send(order);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
})

module.exports = orderRouter