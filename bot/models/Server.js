const { Schema, model } = require('mongoose')

module.exports = model('Server', new Schema({
    uri: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    port: {
        type: Number,
        required: true
    }
}))