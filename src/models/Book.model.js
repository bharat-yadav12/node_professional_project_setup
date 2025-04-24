import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
      },
      author:{
        type:String,
        required:true
      },
      publishedYear:{
        type:Number,
        required:true
      },
      edition:{
        type:Number,
        unique:true
      }
})

 const Book = new mongoose.model("Book",bookSchema);
 export default Book