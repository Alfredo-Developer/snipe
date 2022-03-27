const chalk = require('chalk')
const { colors } = require('../config.json')

const ASCII_TEXT = "             ('-.         .-') _    ('-.     _  .-')               \n" +
"            ( OO ).-.    ( OO ) )  ( OO ).-.( \\( -O )              \n" +
"   .-----.  / . --. /,--./ ,--,'   / . --. / ,------.   ,--.   ,--.\n" +
"  '  .--./  | \\-.  \\ |   \\ |  |\\   | \\-.  \\  |   /`. '   \\  `.'  / \n" +
"  |  |('-..-'-'  |  ||    \\|  | ).-'-'  |  | |  /  | | .-')     /  \n" +
" /_) |OO  )\\| |_.'  ||  .     |/  \\| |_.'  | |  |_.' |(OO  \\   /   \n" +
" ||  |`-'|  |  .-.  ||  |\\    |    |  .-.  | |  .  '.' |   /  /\\_  \n" +
"(_'  '--'\\  |  | |  ||  | \\   |    |  | |  | |  |\\  \\  `-./  /.__) \n" +
"   `-----'  `--' `--'`--'  `--'    `--' `--' `--' '--'   `--'      \n" +
"\n";

const MAIN = chalk.keyword(colors.main)
const SUB = chalk.keyword(colors.sub)

// 45 seconds before (in milliseconds)
const AUTH_BEFORE = 250 * 1000

module.exports = {
    ASCII_TEXT,
    MAIN,
    SUB,
    AUTH_BEFORE
}
