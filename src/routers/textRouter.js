const express = require('express');
const auth = require('../middleware/userAuth');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const ruTextFilePath = path.join(__dirname, '..', '..', 'public', 'assets', 'textDataRu.json');
const engTextFilePath = path.join(__dirname, '..', '..', 'public', 'assets', 'textDataEng.json');

router.get('/readAll/:lang', (req, res) => {
    try {
        if (!req.params.lang && req.params.lang !== 'en' && req.params.lang !== 'ru') {
            return res.status(400).send({ error: 'Invalid request' });
        }
        const filePath = req.params.lang === 'ru' ? ruTextFilePath : engTextFilePath;
        const data = JSON.parse(fs.readFileSync(filePath));
        res.send(data);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});

router.patch('/update/:lang/:id', auth, (req, res) => {
    if (req.user.kind !== 'admin') {
        return res.status(400).send({ error: "You dont have admin privileges" })
    };
    if (!req.params.lang || (req.params.lang !== 'en' && req.params.lang !== 'ru')) {
        return res.status(400).send({ error: 'Invalid request' });
    }
    const filePath = req.params.lang === 'ru' ? ruTextFilePath : engTextFilePath;
    try {
        const data = JSON.parse(fs.readFileSync(filePath));
        const item = data[req.params.id];
        if (item) {
            Object.assign(item, req.body);
            fs.writeFileSync(filePath, JSON.stringify(data));
            return res.send(item);
        }
        res.status(404).send({ error: 'Text item not found' });
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});

module.exports = router;