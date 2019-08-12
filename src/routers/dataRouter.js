const fs = require('fs')
const express = require('express')
const {google} = require('googleapis')
const {OAuth2Client} = require('google-auth-library')
const googleAuth = require('../middleware/googleAuth')
const arrToJSON = require('../utils/arrayToJSON')
const getNewToken = require('../utils/getNewToken')
const auth = require('../middleware/userAuth')

const dataRouter = new express.Router()

dataRouter.get('/data', auth, googleAuth, async (req, res) => {
    const drive = google.drive({
        version: 'v3',
        auth: req.oAuth2Client
    })
    try{
        const fileList = await drive.files.list({
            q: `mimeType='application/vnd.google-apps.spreadsheet' and name contains '${req.user.userID}' and trashed=false`,
            spaces: 'drive',
        })
        res.send(fileList.data.files)
    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }
})

dataRouter.post('/authorizeApp', (req, res) => {
    const redirect_uris = [process.env.REDIRECT_URIS]
    const client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirect_uris[0])
    const url = client.generateAuthUrl(req.body)
    res.send(url)
})

dataRouter.get('/verify', async (req, res) => {
    const code = req.query.code
    try{
        await getNewToken(code)
    } catch(e) {
        res.status(400).send(e)
    }
    res.send()
})

module.exports = dataRouter