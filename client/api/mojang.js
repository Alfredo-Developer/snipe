const fetch = require('node-fetch')
const config = require('../config.json')
const chalk = require('chalk')
const { log } = require('../util/logger')

const changeSkin = async (token) => {
    try {
        await fetch(`https://api.minecraftservices.com/minecraft/profile/skins`, {
            method: 'POST',
    
            body: JSON.stringify({
                url: config.skin.url,
                variant: config.skin.variant
            }),
    
            headers: {
                "Authorization": token,
                "Content-Type": 'application/json'
            }
        }).then(async (response) => response.json().then(async (json) => {
            if(response.status == 200){
                console.log(chalk.green('Changed Skin'));
                log(`Changed skin`)
            }
        }));
    }catch(err) {
        console.log(`[CLIENT] Failed to change skin`)
        console.error(err)
        log(`Failed to change skin`)
    }
}

module.exports = changeSkin
