const mongoose = require('mongoose')
const { schema } = require('./bookData')
mongoose.connect('mongodb+srv://jdjithin:maitexa2255@cluster0.me79b0j.mongodb.net/LIBRARYDB?retryWrites=true&w=majority')
const Schema = mongoose.Schema
const authorSchema = new Schema({
    authorName: {type:String,required:true},
    contact: {type:String},
    image:{type:String,required:true}
})
let authorData=mongoose.model('authorData',authorSchema)
module.exports=authorData;