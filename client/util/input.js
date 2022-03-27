const { SUB } = require('./constants')

const readline = require('readline')
    .createInterface({
        input: process.stdin,
        output: process.stdout
    });

const prompt = (question) => {
    return new Promise((resolve) => {
        readline.question(SUB(`${question} -> `), (answer) => resolve(answer))
    })
}

module.exports = prompt