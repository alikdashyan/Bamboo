const mongoose = require('mongoose')
const validator = require('validator')

const passportUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    passportID: {
        type: String,
        required: true,
        unique: true
    },
    userID: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    contactInfo: {
        emailForRefunds: {
            type: String,
            trim: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('You must enter a valid email')
                }
            }
        },
        skypeViberWhatsApp: {
            type: String,
            trim: true,
        },
        facebookLink: {
            type: String,
            trim: true,
            validate(value){
                if(!(validator.isURL(value) && value.includes('facebook.com'))){
                    throw new Error({message: 'You must enter your facebook profile link'})
                }
            }
        },
    },
})

passportUserSchema.virtual('orders', {
    ref: 'Order',
    localField: 'userID',
    foreignField: 'ID'
})

const PassportUser = mongoose.model('PassportUser', passportUserSchema)

module.exports = PassportUser