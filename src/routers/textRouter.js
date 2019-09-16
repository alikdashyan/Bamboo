const express = require('express')
const auth = require('../middleware/userAuth')
const fs = require('fs')
const path = require('path')

const router = express.Router()
const textFilePath = path.join(__dirname, '..', '..', 'data', 'textData.json')

router.post('/create', auth, (req, res) => {
    if(req.user.kind !== 'admin'){
        return res.status(400).send({error: "You dont have admin privileges"})
    }
    try{
        fs.access(textFilePath, fs.constants.F_OK, (err) => {
            if(err){
                fs.writeFileSync(modelsFilePath, "[]")
            }
        })
        const allData = JSON.parse(fs.readFileSync(textFilePath))
        allData.push(req.body)
        fs.writeFileSync(textFilePath, JSON.stringify(allData))
        res.status(201).send()
    } catch(e) {
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

router.get('/readAll', auth, (req, res) => {
    if(req.user.kind !== 'admin'){
        return res.status(400).send({error: "You dont have admin privileges"})
    }
    try{
        const data = JSON.parse(fs.readFileSync(textFilePath))
        res.send(data)
    } catch(e){
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

router.patch('/update/:id', auth, (req, res) => {
    if(req.user.kind !== 'admin'){
        return res.status(400).send({error: "You dont have admin privileges"})
    }
    try{
        const data = JSON.parse(fs.readFileSync(textFilePath))
        const updateData = data.filter((dataObject) => {
            return req.params.id === dataObject.id
        })
        if(updateData[0]) {
            data.map((elem) => {
                if(elem.id === req.params.id){
                    Object.assign(elem, req.body)
                }
            })
            fs.writeFileSync(textFilePath, JSON.stringify(data))
            return res.send(updateData)
        }
        res.status(404).send({error: "Data not found"})
    } catch(e) {
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

router.delete('/delete/:id', auth, (req, res) => {
    if(req.user.kind !== 'admin'){
        return res.status(400).send({error: "You dont have admin privileges"})
    }
    try{
        const data = JSON.parse(fs.readFileSync(textFilePath))
        data.map((elem) => {
            if(req.params.id === elem.id){
                elem = undefined
            }
        })
        fs.writeFileSync(textFilePath, JSON.stringify(data))
        res.send(data)
    } catch(e) {
        console.log(e)
        res.status(500).send(e)
    }
})

module.exports = router