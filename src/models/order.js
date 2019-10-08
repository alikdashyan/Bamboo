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