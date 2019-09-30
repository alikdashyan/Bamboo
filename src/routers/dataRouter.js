const express = require('express')
const {google} = require('googleapis')
const {OAuth2Client} = require('google-auth-library')
const googleAuth = require('../middleware/googleAuth')
const getNewToken = require('../utils/getNewToken')
const auth = require('../middleware/userAuth')
const arrayToJSON = require('../utils/arrayToJSON')

const dataRouter = new express.Router()

dataRouter.get('/data', auth, googleAuth, async (req, res) => {
    const drive = google.drive({
        version: 'v3',
        auth: req.oAuth2Client
    })
    const sheets = google.sheets('v4')
    try{
        const fileList = await drive.files.list({
            q: `mimeType='application/vnd.google-apps.spreadsheet' and name contains '${req.user.userID}' and trashed=false`,
            spaces: 'drive',
        })
        fileList.data.files.map((spsheet) => {
            sheets.spreadsheets.get({
                spreadsheetId: spsheet.id,
                auth: req.oAuth2Client
            }).then((spreadsheet) => {
                const names = []
                spreadsheet.data.sheets.map((sh) => {
                   names.push(sh.properties.title)
                })
                // sheets.spreadsheets.values.batchGet({
                //     spreadsheetId: spsheet.id,
                //     auth: req.oAuth2Client,
                //     ranges: names
                // }).then((data) => {console.log(data)}).catch(e => console.log(e))
                console.log(names)
            }).catch((e) => {
                console.log(e)
            })
        })
        res.send(fileList.data.files)
    } catch(e) {
        console.log(e)
        res.status(500).send({error: e.message})
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
        res.redirect('/')
    } catch(e) {
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

module.exports = dataRouter