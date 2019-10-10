const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    kind: {
        type: String,
        required: true,
        trim: true,
        default: 'customer'
    },
    name:{
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(/[`~,.<>;':"\/\[\]\|{}()=_+]/.test(value)){
                throw Error({error: 'Name must not contain special characters'})
            }
        }
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(/[`~,.<>;':"\/\[\]\|{}()=_+]/.test(value)){
                throw Error({error: 'Name must not contain special characters'})
            }
        }
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
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw Error({error: 'Email is invalid'})
            }
        }
    },
    emailVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value.length <= 6){
                throw Error("Password length must be greater than 6 characters")
            }
        }
    },
    passwordChange:{
        type: Boolean,
        default: false
    },
    userID: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
})

userSchema.virtual('orders', {
    ref: 'Order',
    localField: 'userID',
    foreignField: 'ID'
})

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'createdBy'
})

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const token = jwt.sign({_id: this._id.toString()}, process.env.JWTKEY)
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token
}

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error('User with this email does not exist')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('User email or password is incorrect')
    }
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User