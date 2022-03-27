const { MAIN, SUB } = require('../util/constants')

const axios = require('axios')
const XBoxLiveAuth = require('@xboxreplay/xboxlive-auth')
const { log } = require('../util/logger')

const authenticateAccounts = async (username, droptime, offset, accounts) => {
    const scheduler = require('../scheduler/scheduler')

    console.log(`[CLIENT] Attempting to authenticate ${accounts.length} accounts...`)
    log(`Attempting to authenticate ${accounts.length} accounts...`)

    for(let account of accounts) {
        await authenticate(account).then(async (authedAccount, err) => {
            if(err) {
                console.log(`[CLIENT] Could not authenticate ${account} | Error: ${err}`)
                log(`Could not authenticate ${account} | Error: ${err}`)
                return
            }

            await scheduler.snipe(username, droptime, offset, authedAccount)
        }).catch(e => {
            console.log(`[CLIENT] Error whilst authenticating ${account}`)
            log(`Error whilst authenticating ${account}`)
        })
    }
}

const authenticate = async (account) => {
    return new Promise(async (resolve, reject) => {
        setTimeout(async () => {
            try {
                const combo = account.split(':');
                let authedAccount = {
                    combo: account,
                    email: '',
                    password: '',
                    token: ''
                }

                console.log(`[CLIENT] Combo: ${combo}`)
                    
                if (!combo[1]) {
                    console.log(`[CLIENT] ${account} does not follow the correct email:password format`);
                    log(`${account} does not follow the correct email:password format`)
                    reject(`Does not follow the correct email:password format`)
                    return
                };
            
                let email = combo[0].trim()
                let password = combo[1].trim()
            
                authedAccount['email'] = email
                authedAccount['password'] = password
            
                const XAuthResponse = await XBoxLiveAuth.authenticate(
                    email,
                    password,
                    {
                        XSTSRelyingParty: 'rp://api.minecraftservices.com/'
                    }
                ).catch((err) => {
                    console.error(err)
                    console.log(`[CLIENT] Failed to authenticate ${email} | Xbox Live`)
                    log(`Failed to authenticate ${email}`)
                    reject(`Failed to authenticate`)
                })
            
                await axios.post('https://api.minecraftservices.com/authentication/login_with_xbox',
                {
                    identityToken: `XBL3.0 x=${XAuthResponse.user_hash};${XAuthResponse.xsts_token}`
                }).then(async (res) => {
                    console.log(`[CLIENT] Authenticated ${email}`)
                    log(`Authenticated ${email}`)
                    authedAccount['token'] = res.data.access_token
                    resolve(authedAccount)
                }).catch(err => {
                    console.log(`[CLIENT] Failed authenticate minecraft api login\nXBL3.0 x=${XAuthResponse.userHash};${XAuthResponse.XSTSToken}`)
                    reject('failed to auth')
                })
            }catch(err) {
                reject(`Failed to authenticate ${account}`)
                log(`Failed to authenticate ${account}`)
            }
        }, 1000 * 30)
    })
}

module.exports = {
    authenticateAccounts
}