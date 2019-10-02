const {google} = require('googleapis')
const arrayToJSON = require('./arrayToJSON')

const sheets = google.sheets("v4")

async function getSheetData(fileList, oAuth2Client) {
    var allData = {};
    const fileInfo = fileList.data.files
    for(let i = 0; i < fileInfo.length; i++){
        allData[fileInfo[i].name] = []
        const spsheet = await sheets.spreadsheets.get({
            spreadsheetId: fileInfo[i].id,
            auth: oAuth2Client
        })
        const sheetsData = spsheet.data.sheets
        for(let j = 0; j < sheetsData.length; j++){
            const sheetValues = await sheets.spreadsheets.values.get({
                spreadsheetId: spsheet.data.spreadsheetId,
                auth: oAuth2Client,
                range: sheetsData[j].properties.title
            })
            let obj = {}
            obj[sheetsData[j].properties.title] = arrayToJSON(sheetValues.data.values)
            allData[fileInfo[i].name].push(obj)
        }
    }
    return allData
}

module.exports = getSheetData