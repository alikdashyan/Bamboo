const express = require('express')
const auth = require('../middleware/userAuth')
const fs = require('fs')
const path = require('path')

const router = express.Router()
const textFilePath = path.join(__dirname, '..', 'data', 'textData.json')

router.post('/create', auth, (req, res) => {
    if(req.user.kind !== 'admin'){
        return res.status(400).send({error: "You dont have admin privileges"})
    }
    try{
        fs.access(textFilePath, fs.constants.F_OK, (err) => {
            if(err){
                fs.writeFileSync(textFilePath, "[]")
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
        let elemFound = false
        let updatedElement
        data.map((elem) => {
            if(elem.id === req.params.id){
                Object.assign(elem, req.body)
                elemFound = true
                updatedElement = elem
            }
        })
        if(!elemFound){
            return res.status(404).send({error: "Requested element is not found"})
        }
        fs.writeFileSync(textFilePath, JSON.stringify(data))
        res.send(updatedElement)
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
        const newArray = data.filter((elem) => {return elem.id !== req.params.id})
        fs.writeFileSync(textFilePath, JSON.stringify(newArray))
        res.send(newArray)
    } catch(e) {
        console.log(e)
        res.status(500).send(e)
    }
})

module.exports = router