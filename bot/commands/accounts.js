const { SlashCommandBuilder } = require('@discordjs/builders')
const Account = require('../models/Account')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('accounts')
        .setDescription('Fetch accounts from the database'),
    async execute(interaction) {        
        await interaction.reply(`Attempting to fetch accounts from the database`)

        let accounts = []
        for await(const account of Account.find()) {
            accounts.push(account.combo)
        }

        await interaction.editReply({
            content: `There are ${accounts.length} accounts in the database`,
            files: [
                {
                    name: 'accounts.txt',
                    attachment: Buffer.from(accounts.join('\n'))
                }
            ]
        })

    }
}