const express = require('express')
const Post = require('../models/post')
const auth = require('../middleware/userAuth')
const multer = require('multer')

const postRouter = new express.Router()

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('Please upload an image file'))
        }
        cb(undefined, true)
    },
});
const upload = multer({storage})

postRouter.post('/create', auth, async (req, res) => {
    if(req.user.kind !== "admin"){
        return res.status(400).send({error: "You dont have admin privileges"})
    }
    try{
        const post = new Post(req.body)
        //post.createdBy = req.user._id
        await post.save()
        res.status(201).send(post)
    } catch(e){
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

postRouter.post('/create/images', auth, upload.array('images', 12), async (req, res) => {
    if(req.user.kind !== "admin"){
        return res.status(400).send({error: "You dont have admin privileges"})
    }
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
        res.status(500).send({error: e.message})
    }     
})

postRouter.get('/view/:id', async (req, res) => {
    try{
        const post = await Post.findOne({_id: req.params.id})
        if(!post){
            return res.status(404).send({error: 'Post not found'})
        }
        res.send(post)
    } catch(e){
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

postRouter.get('/viewAll', auth, async (req, res) => {
    if(req.user.kind !== "admin"){
        return res.status(400).send({error: "You dont have admin privileges"})
    }
    try{
        await req.user.populate('posts').execPopulate()
        res.send(req.user.posts)
    } catch(e){
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

postRouter.patch('/update/:id', auth, async(req, res) => {
    if(req.user.kind !== "admin"){
        return res.status(400).send({error: "You dont have admin privileges"})
    }
    try{
        let post = await Post.findOne({_id: req.params.id, createdBy: req.user._id})
        if(!post){
            return res.status(404).send({error: 'Post not found'})
        }
        Object.assign(post, req.body)
        await post.save()
        res.send(post)
    } catch(e){
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

postRouter.delete('/remove/:id', auth, async(req, res) => {
    if(req.user.kind !== "admin"){
        return res.status(400).send({error: "You dont have admin privileges"})
    }
    try{
        const post = await Post.findOneAndDelete({id: req.params.id, createdBy: req.user._id})
        if(!post){
            return res.status(404).send({error: 'Post not found'})
        }
    } catch(e){
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

module.exports = postRouter
