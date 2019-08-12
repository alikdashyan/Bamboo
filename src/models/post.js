const mongoose = require('mongoose')
const validator = require('validator')

const postSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    mainImage: {
        type: String,
        trim: true,
    },
    imageUrls: [{
        imgURL: {
            type: String,
            required: true,
            trim: true
        }
    }],
    createdBy: {
        type: String,
        required: true,
        trim: true,
        refPath: 'externalModels'
    },
    externalModels: {
        type: String,
        enum: ['User', 'PassportUser']
    }
})

const Post = new mongoose.model('Post', postSchema)

module.exports = Post