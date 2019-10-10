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
    kind: {
        type: String,
        required: true,
        trim: true,
        default: 'customer'
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

passportUserSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'createdBy'
})

const PassportUser = mongoose.model('PassportUser', passportUserSchema)

module.exports = PassportUser