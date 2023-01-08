const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://jdjithin:maitexa2255@cluster0.me79b0j.mongodb.net/LIBRARYDB?retryWrites=true&w=majority')
const Schema=mongoose.Schema
const bookSchema=new Schema({
    bookName:{type:String,required:true},
    author:{type:String,required:true},
    description:{type:String},
    image:{type:String,required:true}
})
let bookData=mongoose.model('bookdata',bookSchema)
module.exports=bookData;