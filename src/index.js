const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const passport = require('passport')
const cookieSession = require('cookie-session')
const dataRouter = require('./routers/dataRouter')
const userRouter = require('./routers/userRouter')
const orderRouter = require('./routers/orderRouter')
const postRouter = require('./routers/postRouter')
const authRouter = require('./routers/authRoutes')
require('./utils/passport-setup')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

const publicDirectory = path.join(__dirname, '../public')
const port = process.env.PORT || 3000
const app = express()

app.use(express.json())

//Initialize passport
app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys: [process.env.COOKIE_ENCRYPT_KEY]
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(publicDirectory))
app.use(dataRouter)
app.use(userRouter)
app.use(orderRouter)
app.use('/auth', authRouter)
app.use('/post', postRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})