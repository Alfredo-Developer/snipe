const { SlashCommandBuilder } = require('@discordjs/builders')
const Server = require('../models/Server')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addserver')
        .setDescription('Add a server to the database')
        .addStringOption(option => {
            option.setName('server')
            option.setRequired(true)
            option.setDescription('The server URI')

            return option
        }),
    async execute(interaction) {
        const uri = interaction.options.getString('server')
        
        await interaction.reply(`Adding ${uri} to the server database`)

        let split = uri.split(':')

        await Server.create({
            uri: uri,
            address: split[0],
            port: split[1]
        }, async (err) => {
            if(err) {
                await interaction.editReply(`There was an early whilst adding ${uri} to the server database`)
                return
            }
            
            await interaction.editReply(`Successfully added ${uri} to the server database`)
        })
    }
}