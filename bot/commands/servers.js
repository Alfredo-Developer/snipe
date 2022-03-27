const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const Server = require('../models/Server')
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servers')
        .setDescription('Fetch server data'),
    async execute(interaction) {
        await interaction.reply(`Fetching server information`)

        let responses = []

        console.log(`[SERVER] Fetching server statuses`)
        for await(const server of Server.find()) {
            console.log(`[SERVER] Checking status of ${server.uri}`)
            try {
                const data = await axios.get(`http://${server.uri}/status`).then(r => r.data)
                responses.push(`🟢 \`${server.uri}\` - online`)
                console.log(`[${server.uri}] Status - Online`)
            }catch(err) {
                responses.push(`🔴 \`${server.uri}\` - offline`)
                console.log(`[${server.uri}] Status - Offline`)
            }
        }

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('servers')
            .setDescription(responses.join('\n'))
        
        await interaction.followUp({
            embeds: [embed]
        })
    }
}