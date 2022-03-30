const chalk = require('chalk')
const { AUTH_BEFORE } = require('../util/constants')

const { authenticateAccounts: authenticate } = require('../auth/authenticator')
const { successfulSnipe } = require('../util/webhook')
const { sendLogs, log } = require('../util/logger')
const Socket = require('../socket')
const changeSkin = require('../api/mojang')
const fs = require('fs')
const https = require('https')
const moment = require('moment')

const proxies = fs.readFileSync('proxies.txt', 'utf8').split('\n').map(proxy => proxy.trim())


const authentication = async (username, droptime, offset, accounts) => {
    const timeUntilAuthentication = ((droptime - offset) - AUTH_BEFORE) - Date.now()

    if(timeUntilAuthentication < AUTH_BEFORE) {
        // start authenticating
        await authenticate(username, droptime, offset, accounts)
        return
    }

    setTimeout(async () => {
        await authenticate(username, droptime, offset, accounts)
    }, timeUntilAuthentication)
}

const snipe = async (username, droptime, offset, account, proxyIndex) => {
    const timeUntilDrop = (droptime - offset) - Date.now()

    let token = account.token

    const socket = new Socket('POST', 'api.minecraftservices.com', 'api.minecraftservices.com', '/minecraft/profile', {'profileName': username}, {'Authorization': `Bearer ${token}`}, {})
    setTimeout(() => {
        console.log(`[CLIENT] Preparing socket connection for ${account.email}`)
        socket.connect(() => {
            console.log(`[CLIENT] Established connection to Mojang API with ${account.email}`)
            log(`Established connection to Mojang API with ${account.email}`)
        }, async data => {
            const status = socket.res.statusCode
            let snipeStatus = 'Fail'
    
            switch(status) {
                case 200: {
                    snipeStatus = 'Success'
                    await successfulSnipe(username)
                    await changeSkin(token)
                    console.log(`[CLIENT] Sucessfully sniped ${username} on ${account.email}`)
                    log(`Successfully sniped ${username} on ${account.email}`)
                    break
                }
                case 429: {
                    snipeStatus = 'Ratelimited'
                }
            }
    
            console.log(`[CLIENT] ${status}     ${moment().format('h:mm:ss.SSSS')}      ${snipeStatus}`)
            log(`${status} @ ${moment().format('h:mm:ss.SSSS')} | ${snipeStatus} with ${account.email}`)
        })
    }, timeUntilDrop - 15000)

    setTimeout(() => {
        for(let i=0; i<2; i++) {
            socket.send()
            console.log(`[CLIENT] Sent req ${i+1} for ${account.email} @ ${moment().format('h:mm:ss.SSSS')}`)
            log(`Sent req ${i+1} for ${account.email} @ ${moment().format('h:mm:ss.SSSS')}`)
        }
    }, timeUntilDrop)

    setTimeout(() => {
        socket.end()
        console.log(`[CLIENT] Socket disconnected from Mojang API`)
    }, timeUntilDrop + 15000)
}

const logs = async (username, droptime, offset) => {
    // 45 seconds after the name drops
    const dropsAt = (droptime.getTime() + (1000 * 45))
    const timeUntilLogSend = dropsAt - Date.now()

    setTimeout(async () => {
        console.log(`[CLIENT -> SERVER] Logs have been sent to the main server`)
        await sendLogs(username, offset)
    }, timeUntilLogSend)
}

module.exports = {
    snipe,
    authentication,
    logs
}
