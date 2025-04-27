import { Product } from "../models/Product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const createProduct = asyncHandler(async (req,res,next) => {
    const product = await Product.create(req.body);

    res.status(201).json(product);
})

const getProducts = asyncHandler(async (req,res,next)=>{
    const products = await Product.find();
    res.status(200).json(products);
})
const getProductsById = asyncHandler(async (req,res,next)=>{
    console.log("get product by id is called",req.params.id)
    const product = await Product.findById(req.params.id);
    if(!product){
        res.json({
            message:"product not found"
        })
    }
    res.status(200).json(product);
})
const getProductsByIdAndUpdate = asyncHandler(async (req,res,next)=>{
    console.log(req.query.params,req.body)
    const product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true});
    if(!product) res.status(404).json({message:"product not found"})
    res.status(200).json(product);
})
const getProductsByIdAndDelete = asyncHandler(async (req,res,next)=>{
    const product = await Product.findByIdAndDelete(req.params.id);
    if(!product) res.status(404).json({message:"product not found"})
    res.status(200).json({message:"product deleted successfully"})
})
export {createProduct,getProducts,getProductsById,getProductsByIdAndUpdate,getProductsByIdAndDelete}