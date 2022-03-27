const chalk = require('chalk')
const { AUTH_BEFORE } = require('../util/constants')

const { authenticateAccounts: authenticate } = require('../auth/authenticator')
const { successfulSnipe } = require('../util/webhook')
const { sendLogs, log } = require('../util/logger')
const changeSkin = require('../api/mojang')
const https = require('https')
const moment = require('moment')


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

const snipe = async (username, droptime, offset, account) => {
    const timeUntilDrop = (droptime - offset) - Date.now()

    const data = JSON.stringify({
        profileName: username
    })

    let token = account.token

    // schedule
    setTimeout(async () => {
        const options = {
            host: `api.minecraftservices.com`,
            port: 443,
            path: `/minecraft/profile`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'Authorization': `Bearer ${token}`
            }
        }

        for(let i = 0; i < 2; i++) {
            console.log(`[CLIENT] Sent @ ${moment().format('h:mm:ss.SSSS')}`)
            log(`[CLIENT] Sent @ ${moment().format('h:mm:ss.SSSS')}`)
            let req = https.request(options, async (res) => {
                // log time

                let coloredStatusCode = chalk.red(res.statusCode)
                let snipeStatus = 'Fail'

                switch(res.statusCode) {
                    case 200:
                        snipeStatus = 'Success'
                        coloredStatusCode = chalk.green(res.statusCode)
                        await successfulSnipe(username)
                        await changeSkin(token)
                        console.log(chalk.green(`[CLIENT] Sucessfully sniped ${username} on ${account.email}`))
                        break;
                    case 429:
                        snipeStatus = 'Ratelimited'
                        break;
                    case 401:
                        snipeStatus = 'Unauthorized'
                        break;
                }

                console.log(`[CLIENT] ${coloredStatusCode}     ${moment().format('h:mm:ss.SSSS')}      ${snipeStatus}`)
                log(`${res.statusCode} @ ${moment().format('h:mm:ss.SSSS')} | ${snipeStatus} with ${account.email}`)
            })

            req.write(data)
            req.end()
        }
    }, timeUntilDrop)
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
