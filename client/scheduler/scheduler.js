const chalk = require('chalk')
const { AUTH_BEFORE } = require('../util/constants')

const { authenticateAccounts: authenticate } = require('../auth/authenticator')
const { successfulSnipe } = require('../util/webhook')
const { sendLogs, log } = require('../util/logger')
const Socket = require('../socket')
const changeSkin = require('../api/mojang')
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

    const proxy = {
        host: proxies[proxyIndex].split(':')[0],
        port: parseInt(proxies[proxyIndex].split(':')[1])
    }
    console.log(`[CLIENT] Using ${proxy} for ${account.email}`)
    log(`Using ${proxy} for ${account.email}`)

    // schedule
    setTimeout(async () => {
        // todo: make it so we connect sockets a few seconds before and then we send the data when its time to snipe
        const socket = new Socket('POST', 'api.minecraftservices.com', 'api.minecraftservices.com', '/minecraft/profile', {'profileName': username}, {'Authorization': `Bearer ${token}`}, proxy)
        socket.connect()
        
        for(let i = 0; i < 2; i++) {
            socket.send(async (data) => {
                const status = socket.getStatusCode()

                let coloredStatusCode = chalk.red(status)
                let snipeStatus = 'Fail'

                if(status == 200) {
                    snipeStatus = 'Success'
                    coloredStatusCode = chalk.green(status)
                    await successfulSnipe(username)
                    await changeSkin(token)
                    console.log(chalk.green(`[CLIENT] Sucessfully sniped ${username} on ${account.email}`))
                }

                console.log(`[CLIENT] ${coloredStatusCode}     ${moment().format('h:mm:ss.SSSS')}      ${snipeStatus}`)
                log(`${status} @ ${moment().format('h:mm:ss.SSSS')} | ${snipeStatus} with ${account.email}`)
            })
            console.log(`[CLIENT] Sent @ ${moment().format('h:mm:ss.SSSS')}`)
            log(`Sent @ ${moment().format('h:mm:ss.SSSS')}`)

            socket.end()
        }

        // const options = {
        //     host: `api.minecraftservices.com`,
        //     port: 443,
        //     path: `/minecraft/profile`,
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Content-Length': data.length,
        //         'Authorization': `Bearer ${token}`
        //     }
        // }

        // for(let i = 0; i < 2; i++) {
        //     console.log(`[CLIENT] Sent @ ${moment().format('h:mm:ss.SSSS')}`)
        //     log(`Sent @ ${moment().format('h:mm:ss.SSSS')}`)
        //     let req = https.request(options, async (res) => {
        //         // log time

        //         let coloredStatusCode = chalk.red(res.statusCode)
        //         let snipeStatus = 'Fail'

        //         switch(res.statusCode) {
        //             case 200:
        //                 snipeStatus = 'Success'
        //                 coloredStatusCode = chalk.green(res.statusCode)
        //                 await successfulSnipe(username)
        //                 await changeSkin(token)
        //                 console.log(chalk.green(`[CLIENT] Sucessfully sniped ${username} on ${account.email}`))
        //                 break;
        //             case 429:
        //                 snipeStatus = 'Ratelimited'
        //                 break;
        //             case 401:
        //                 snipeStatus = 'Unauthorized'
        //                 break;
        //         }

        //         console.log(`[CLIENT] ${coloredStatusCode}     ${moment().format('h:mm:ss.SSSS')}      ${snipeStatus}`)
        //         log(`${res.statusCode} @ ${moment().format('h:mm:ss.SSSS')} | ${snipeStatus} with ${account.email}`)
        //     })

        //     req.write(data)
        //     req.end()
        // }
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
