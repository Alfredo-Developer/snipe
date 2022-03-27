const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const Server = require('../models/Server')
const Account = require('../models/Account')
const axios = require('axios')

Object.defineProperty(Array.prototype, 'chunk', {
	value: function (chunkSize) {
		var R = [];
		for (var i = 0; i < this.length; i += chunkSize) R.push(this.slice(i, i + chunkSize));
		return R;
	}
});

const CHUNK_SIZE = 5;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snipe')
        .setDescription('Snipe a name')
        .addStringOption(option => {
            option.setName('username')
            option.setRequired(true)
            option.setDescription('The username')

            return option
        })
        .addIntegerOption(option => {
            option.setName('offset')
            option.setRequired(true)
            option.setDescription('The offset')

            return option
        }),
    async execute(interaction) {
        const name = interaction.options.getString('username')
        const offset = interaction.options.getInteger('offset')
        
        await interaction.reply(`Adding ${name} to queue with ${offset} offset`)

        const servers = await Server.find()
        const accounts = await Account.find({}, 'combo').lean()

        const combos = accounts.map(acc => acc.combo)

        const result = combos.reduce((resultArray, item, index) => { 
            const chunkIndex = Math.floor(index/CHUNK_SIZE)
          
            if(!resultArray[chunkIndex]) {
              resultArray[chunkIndex] = [] // start a new chunk
            }
          
            resultArray[chunkIndex].push(item)
          
            return resultArray
        }, [])

        const responses = []

        let index = 0
        for (const server of servers) {
            try {
                const data = await axios.post(`http://${server.uri}/snipe`, {
                    username: name,
                    offset: offset,
                    accounts: result[index]
                })
                responses.push(`🟢 \`${server.uri}\` - queued`)
                console.log(`[${server.uri}] Queued ${name}`)
                index++
            } catch(err) {
                responses.push(`🔴 \`${server.uri}\` - Failed to queue`)
                console.log(`[${server.uri}] Failed to queue ${name}`)
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