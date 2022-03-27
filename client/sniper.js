const { fetchDropTime } = require('./api/teun')
const scheduler = require('./scheduler/scheduler')
const { log } = require('./util/logger')

const setupSniper = async (username, offset, accounts) => {
    console.log(`[CLIENT] Fetching droptime for ${username}`)
    log(`Fetching droptime for ${username}`)
    const droptime = await fetchDropTime(username)

    console.log(`[CLIENT] Waiting until authentication. Target: ${username}, Offset: ${offset}, Accounts: ${accounts.length}`)
    log(`Waiting until authentication. Target: ${username}, Offset: ${offset}, Accounts: ${accounts.length}`)
    await scheduler.authentication(username, droptime, offset, accounts)
    console.log(`[CLIENT] Sending logs 45 seconds after name drop`)
    log(`Sending logs 45 seconds after name drop`)
    await scheduler.logs(username, droptime, offset)
}

module.exports = {
    setupSniper
}