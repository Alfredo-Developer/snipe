const mongoose = require('mongoose')
const fs = require('fs')
const { Client, Intents, Collection } = require('discord.js')
require('dotenv').config()

const client = new Client({
    intents: [Intents.FLAGS.GUILDS]
})

client.commands = new Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for(const file of commandFiles) {
    const command = require(`./commands/${file}`)
    if(!command.data) continue
    client.commands.set(command.data.name, command)
}

client.once('ready', () => {
    console.log(`[SERVER] Main instance is now online`)
})

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)
    if(!command) return

    console.log(`[SERVER] Received Command: ${interaction.commandName}`)

    try {
        await command.execute(interaction)
    }catch(err) {
        console.error(`[SERVER] Error whilst executing ${interaction.commandName}.\n${err}`)
        await interaction.reply({
            content: `There was an error whilst executing this command.`,
            ephemeral: true
        })
    }
})

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log(`[SERVER] Connected to Mongo Database`))
.catch(err => console.error(`[SERVER] Could not connect to Mongo Database: ${err}`))

client.login(process.env.TOKEN)