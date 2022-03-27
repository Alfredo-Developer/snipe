const { SlashCommandBuilder } = require('@discordjs/builders')
const Server = require('../models/Server')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeserver')
        .setDescription('Remove a server from the database')
        .addStringOption(option => {
            option.setName('uri')
            option.setRequired(true)
            option.setDescription('Server uri')

            return option
        }),
    async execute(interaction) {
        const uri = interaction.options.getString('uri')
        
        await interaction.reply(`Attempting to remove server from the database`)

        await Server.deleteOne({
            uri: uri
        })

        await interaction.editReply(`Removed server from the database`)
    }
}