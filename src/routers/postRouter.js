const express = require('express')
const Post = require('../models/post')
const auth = require('../middleware/userAuth')
const multer = require('multer')

const postRouter = new express.Router()
const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 1000000,
        preservePath: true
    },
})

postRouter.post('/create', auth, async (req, res) => {
    if(req.user.kind !== "admin"){
        return res.status(400).send({error: "You dont have admin privileges"})
    }
    try{
        const post = new Post(req.body)
        post.createdBy = req.user._id
        await post.save()
        res.status(201).send(post)
    } catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

postRouter.post('/create/images', auth, upload.array('images', 12), async (req, res) => {
    if(!req.query.postId){
        return res.status(400).send({error: 'Invalid request'})
    }
    try{
        const post = await Post.findOne({_id: req.query.postId})
        if(!post){
            res.status(400).send({error: "Post not found"})
        }
        req.files.map((file) => {
            post.imageUrls = post.imageUrls.concat({imgURL: file.path})
        })
        await post.save()
        res.status(200).send(post)
    } catch(e){
        console.log(e)
        res.status(400).send(e)
    }     
})



module.exports = postRouter
