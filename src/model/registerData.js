const mongoose = require('mongoose')
const { schema } = require('./bookData')
mongoose.connect('mongodb+srv://jdjithin:maitexa2255@cluster0.me79b0j.mongodb.net/LIBRARYDB?retryWrites=true&w=majority')
const Schema = mongoose.Schema

const registerSchema = new Schema({
    loginId: { type: Schema.Types.ObjectId, ref: "loginData" },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
})

let registerData = mongoose.model('registerData', registerSchema)
module.exports = registerData