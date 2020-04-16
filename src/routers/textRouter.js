const express = require('express');
const auth = require('../middleware/userAuth');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'eu-central-1'
});
const router = express.Router();
const ruTextFilePath = path.join(__dirname, '..', '..', 'public', 'assets', 'textDataRu.json');
const engTextFilePath = path.join(__dirname, '..', '..', 'public', 'assets', 'textDataEng.json');

router.get('/readAll/:lang', async (req, res) => {
    try {
        if (!req.params.lang && req.params.lang !== 'en' && req.params.lang !== 'ru') {
            return res.status(400).send({ error: 'Invalid request' });
        };
        const fileName = req.params.lang === 'ru' ? 'textDataRu.json' : 'textDataEng.json';
        const txtResponse = await s3.getObject({
            Bucket: 'amz-bambooo',
            Key: fileName
        }).promise();
        res.send(txtResponse.Body)
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});

router.patch('/update/:lang/:id', auth, async (req, res) => {
    if (req.user.kind !== 'admin') {
        return res.status(400).send({ error: "You dont have admin privileges" })
    };
    if (!req.params.lang || (req.params.lang !== 'en' && req.params.lang !== 'ru')) {
        return res.status(400).send({ error: 'Invalid request' });
    }
    const fileName = req.params.lang === 'ru' ? 'textDataRu.json' : 'textDataEng.json';
    try {
        let txtResponse = await s3.getObject({
            Bucket: 'amz-bambooo',
            Key: fileName
        }).promise();
        let txtData = JSON.parse(txtResponse.Body.toString());
        const item = txtData[req.params.id];
        if (!item) {
            res.status(404).send({ error: 'Text item not found' })
        }
        Object.assign(item, req.body);
        await s3.deleteObject({
            Bucket: 'amz-bambooo',
            Key: fileName
        }).promise();
        await s3.putObject({
            Bucket: 'amz-bambooo',
            Key: fileName,
            Body: Buffer.from(JSON.stringify(txtData))
        }).promise();
        res.send(item)
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});

module.exports = router;