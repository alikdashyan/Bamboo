const {OAuth2Client} = require('google-auth-library')
const fs = require('fs')
const AppToken = require('../models/appToken')

async function getAuthClient(code){
    try{
        const redirect_uris = [process.env.REDIRECT_URIS]
        const client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirect_uris[0])
        client.on('tokens', async (tokens) => {
            if(!tokens.refresh_token){
                try{
                    const allTokens = await AppToken.find({})
                    const previousToken = allTokens[0]
                    previousToken.access_token = tokens.access_token
                    previousToken.scope = tokens.scope
                    previousToken.token_type = tokens.token_type
                    previousToken.expiry_date = tokens.expiry_date
                    await previousToken.save()
                    return console.log('Token updated')
                } catch(e){
                    console.log(e)
                }
            }
            await AppToken.deleteMany({})
            const tokenData = new AppToken(tokens)
            await tokenData.save()
            console.log('Token stored to database')
        })
        const token = await client.getToken(code)
        client.setCredentials(token.tokens)
    } catch (e){
        throw e
    }
    return client
}

module.exports = getAuthClient