const { Schema, model } = require('mongoose')

module.exports = model('Account', new Schema({
    combo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
}))