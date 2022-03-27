const axios = require('axios')

const fetchSearches = async (username) => {
    const response = await axios.get(`https://mojang-api.teun.lol/searches/${username}`)

    if(response.status == 200) {
        return response.data.searches
    }

    return null
}

const fetchDropTime = async (username) => {
    const response = await axios.get(`https://api.star.shopping/droptime/${username}`, {headers: {
        'User-Agent': 'Sniper'
    }}).catch(err => {
        throw err
    })

    if(response.data.error) return null

    return new Date((response.data.unix * 1000))
}

module.exports = {
    fetchSearches,
    fetchDropTime
}