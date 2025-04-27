import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String
    },
    price:{
        type:Number
    },
    category:{
        type:String
    },
    description:{
        type:String
    }
});

const Product = new mongoose.model("Product",productSchema);

export {Product}