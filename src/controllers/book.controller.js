import Book from "../models/Book.model.js";
//import asyncHandler from "../utils/asyncHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export  const createBook = asyncHandler(async (req,res,next)=>{
    console.log("createBook is called with req,res,next", req.url)
    const {name,author,publishedYear,edition} = req.body;
    const book = await Book.create({name,author,publishedYear,edition})
    res.status(201).json(book)
})

export const getAllBooks = asyncHandler(async (req,res,next)=>{
    const books = await Book.find()
    res.status(200).json(books)
})

export const getBookById = asyncHandler(async (req, res, next)=>{
    const book = await Book.findById(req.params.id)
    if(!book){
        return res.status(404).json({message: "Book not found"})
    }
    res.status(200).json(book)
})
export const updateBook = asyncHandler(async (req, res, next)=>{
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if(!book){
        return res.status(404).json({message: "Book not found"})
    }
    res.status(200).json(book)
})
export const deleteBook = asyncHandler(async (req, res, next)=>{
    const book = await Book.findByIdAndDelete(req.params.id)
    if(!book){
        return res.status(404).json({message: "Book not found"})
    }
    res.status(200).json({message: "Book deleted successfully"})
})
export const getBookByEdition = asyncHandler(async (req, res, next)=>{
    const book = await Book.findOne({edition: req.params.edition})
    if(!book){
        return res.status(404).json({message: "Book not found"})
    }
    res.status(200).json(book)
})
