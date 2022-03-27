const config = require('../config.json')
const { Webhook, MessageBuilder } = require('discord-webhook-node')

const hook = new Webhook(config.webhook.logsURL)
hook.setUsername(`huntah`)

let logs = []

const log = (log) => {
    logs.push(log)
}

const sendLogs = async (username, offset) => {
    hook.send(new MessageBuilder()
        .setTitle(`log - ${username} - ${offset}ms`)
        .setDescription(logs.join('\n'))
        .setTimestamp()
    )
    logs = []
}

module.exports = {
    log,
    sendLogs
}