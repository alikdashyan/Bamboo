const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const PassportUser = require('../models/passportUser')
const generateUniqueString = require('../utils/generateUniqueString')

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
   PassportUser.findById(id).then((user) => {
       done(null, user)
   }).catch((e) => {done(e, null)}) 
})

passport.use(new GoogleStrategy({
        callbackURL: `${process.env.APP_URL}/auth/google/redirect`,
        clientID: process.env.PASSPORT_CLIENT_ID,
        clientSecret: process.env.PASSPORT_CLIENT_SECRET
    }, async (accessToken, refreshToken, profile, done) => {
        try{
            const existingUser = await PassportUser.findOne({passportID: profile.id})
            if(existingUser){
                done(null, existingUser)
            } else {
                const user = new PassportUser({
                    name: profile.name.givenName,
                    lastName: profile.name.familyName,
                    passportID: profile.id,
                    email: profile._json.email
                })
                user.userID = await generateUniqueString()
                await user.save()
                done(null, user)
            }
         } catch(e){
             console.log(e)
         }
    })
)