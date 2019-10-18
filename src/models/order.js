const mongoose = require('mongoose')
const validator = require('validator')

const orderSchema = new mongoose.Schema({
    ID: {
        type: String,
        required: true,
        refPath: 'externalModels'
    },
    status:{
        type: String,
        required: true,
        trim: true,
        default: "pending"
    },
    emailForRefunds: {
        type: String,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Provided email is invalid')
            }
        }
    },
    userContactInfo: {
        type: Object,
        required: true
    },
    productLink: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error({message: 'You must enter a valid product URL'})
            }
        }
    },
    buyingsPerDay: {
        type: Number,
        required: true,
    },
    itemPrice: {
        type: Number,
        required: true,
    },
    totalBuyingSummary: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    readyForPayment: {
        type: Boolean,
        required: true,
        default: false
    },
    additionalInfo: {
        type: String,
        trim: true
    },
    keywords: {
        type: String,
        trim: true
    },
    externalModels: {
        type: String,
        enum: ['User', 'PassportUser']
    }
}, {timestamps: true})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order