const { SlashCommandBuilder } = require('@discordjs/builders')
const Account = require('../models/Account')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeaccount')
        .setDescription('Remove an account from the database')
        .addStringOption(option => {
            option.setName('email')
            option.setRequired(true)
            option.setDescription('Account email')

            return option
        }),
    async execute(interaction) {
        const email = interaction.options.getString('email')
        
        await interaction.reply(`Attempting to remove account from the database`)

        await Account.deleteOne({
            email: email
        })

        await interaction.editReply(`Removed account from the database`)
    }
}