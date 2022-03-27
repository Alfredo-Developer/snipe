const { Webhook, MessageBuilder } = require('discord-webhook-node')

const { webhook } = require('../config.json')

const successfulSnipe = async (username) => {
    const hook = new Webhook(webhook.url)
    const embed = new MessageBuilder()
        .setTitle(webhook.title.replace('{username}', username))
        .setDescription(webhook.description.replace('{username}', username))
        .setColor(webhook.color);

    await hook.send(embed)
}

module.exports = {
    successfulSnipe
}
