const mongoose = require('mongoose')
const { schema } = require('./bookData')
mongoose.connect('mongodb+srv://jdjithin:maitexa2255@cluster0.me79b0j.mongodb.net/LIBRARYDB?retryWrites=true&w=majority')
const Schema = mongoose.Schema

const loginSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
})

let loginData = mongoose.model('loginData', loginSchema)
module.exports = loginData