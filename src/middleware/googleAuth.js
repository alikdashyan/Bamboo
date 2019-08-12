const {OAuth2Client} = require('google-auth-library')
const AppToken = require('../models/appToken')

const auth = async (req, res, next) => {
    try{
        const client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URIS[0])
        client.on('tokens', async (tokens) => {
            try{
                if(!tokens.refresh_token){
                    const allTokens = await AppToken.find({})
                    const previousToken = allTokens[0]
                    previousToken.access_token = tokens.access_token
                    previousToken.scope = tokens.scope
                    previousToken.token_type = tokens.token_type
                    previousToken.expiry_date = tokens.expiry_date
                    await previousToken.save()
                    return console.log('Token updated')
                }
                await AppToken.deleteMany({})
                const tokenData = new AppToken(tokens)
                await tokenData.save()
                console.log('Token stored to database')
            } catch(e){
                res.status(400).send(e)
            }
        })
        const token = await AppToken.find({})
        client.setCredentials(token[0])
        req.oAuth2Client = client
        next()
    } catch (e){
        console.log(e)
    }
}

module.exports = auth