import mongoose from "mongoose";


const authorSchema =  new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
    },
    country:{
        type:String
    }

});

const Author = new mongoose.model("Author",authorSchema);

export {Author}