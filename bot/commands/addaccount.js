const { SlashCommandBuilder } = require('@discordjs/builders')
const Account = require('../models/Account')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addacount')
        .setDescription('Add an account to the database')
        .addStringOption(option => {
            option.setName('combo')
            option.setRequired(true)
            option.setDescription('Account combo | Separated by a comma (email:password)')

            return option
        }),
    async execute(interaction) {
        const combo = interaction.options.getString('combo')
        
        await interaction.reply(`Attempting to add account to the database`)

        await Account.create({
            combo: combo,
            email: combo.split(':')[0]
        }, async (err) => {
            if(err) {
                await interaction.editReply(`There was an early whilst adding ${combo} to the database`)
                return
            }
            
            await interaction.editReply(`Successfully added account to the database`)
        })
    }
}