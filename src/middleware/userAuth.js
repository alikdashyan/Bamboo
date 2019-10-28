const User = require('../models/user')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    if(req.user){
        return next()
    }
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const payload = jwt.verify(token, process.env.JWTKEY)
        const user = await User.findOne({_id: payload._id, 'tokens.token': token})
        if(!user){
            return res.status(401).send({error: 'You must be authorized'})
        }
        req.user = user
        req.token = token
        next()
    } catch(e){
        console.log(e)
        res.status(401).send({error: e.message})
    }
}

module.exports = auth