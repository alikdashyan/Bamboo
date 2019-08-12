const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    access_token: {
        type: String,
        required: true
    },
    refresh_token: {
        type: String,
        required: true
    },
    scope: {
        type: String,
        required: true
    },
    token_type: {
        type: String,
        required: true
    },
    expiry_date: {
        type: Date,
        required: true
    }
})

const appToken = mongoose.model('AppToken', tokenSchema)

module.exports = appToken