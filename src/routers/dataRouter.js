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
        const allData = {}
        fileList.data.files.map(async (spsheet) => {
            allData[spsheet.name] = []
            const spreadsheet = await sheets.spreadsheets.get({
                spreadsheetId: spsheet.id,
                auth: req.oAuth2Client
            })
            const names = []
            spreadsheet.data.sheets.map((sh) => {
               names.push(sh.properties.title)
            })
            const data = await sheets.spreadsheets.values.batchGet({
                spreadsheetId: spsheet.id,
                auth: req.oAuth2Client,
                ranges: names
            })
            data.data.valueRanges.map((ssData) => {
                allData[spsheet.name].push(arrayToJSON(ssData.values))
            })
        })
        setTimeout(() => {console.log(allData)}, 2000)
        res.send(allData)
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