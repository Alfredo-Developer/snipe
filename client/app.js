const express = require('express')
const config = require('./config.json')
const Sniper = require('./sniper')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/status', (req, res) => {
    res.send({
        status: 'online'
    })
})

app.post('/snipe', async (req, res) => {
    let { username, offset, accounts } = req.body
    res.sendStatus(201)
    console.log(`[CLIENT] POST /snipe - Name: ${username}, Offset: ${offset}`)
    await Sniper.setupSniper(username, offset, accounts)
})

app.listen(config.port, () => {
    console.log(`[CLIENT] Client is now listening to requests on port ${config.port}`)
})