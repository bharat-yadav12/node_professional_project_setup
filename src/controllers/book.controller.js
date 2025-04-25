import Book from "../models/Book.model.js";
//import asyncHandler from "../utils/asyncHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// export  const createBook = asyncHandler(async (req,res,next)=>{
//     console.log("createBook is called with req,res,next", req.url)
//     const {name,author,publishedYear,edition} = req.body;
//     const book = await Book.create({name,author,publishedYear,edition})
//     res.status(201).json(book)
// })

// insert many books at a time 
export const createBook = asyncHandler(async (req, res, next) => {
    try {
      const books = await Book.insertMany(req.body);  // Insert an array of books
      res.status(201).json({
        message: "Books added successfully",
        books,
      });
    } catch (err) {
      next(err);
    }
  });

// export const getAllBooks = asyncHandler(async (req,res,next)=>{
//     const books = await Book.find()
//     res.status(200).json(books)
// })

// getbooks with pagination and sorting and filter by author and published year
export const getAllBooks = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, sort = 'name', author, publishedYear } = req.query;
    console.log('req.query', req.query)
  
    const query = {};
    if (author) query.author = author;
    if (publishedYear) query.publishedYear = publishedYear;
  
    const pageNum = Number(page);
    const limitNum = Number(limit);
  
    const books = await Book.find(query)
      .sort(sort)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);
  
    const total = await Book.countDocuments(query);
  
    res.status(200).json({
      total,
      page: pageNum,
      limit: limitNum,
      books
    });
  });
  


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


// other way to apply pagination and sorting and filter by author and published year
// Roadmap for This Module
// We'll enhance your GET /api/books API like this:

// GET /api/books?limit=5&page=2&sort=name&author=someAuthor&publishedYear=2022

// ✅ Step 1: Accept Query Parameters in getAllBooks
// Update your controller to extract query params:

// 🔧 In book.controller.js
// Replace your current getAllBooks with:

// js
// Copy
// Edit
// export const getAllBooks = asyncHandler(async (req, res, next) => {
//     const queryObj = { ...req.query }; // clone query object

//     const excludeFields = ['page', 'sort', 'limit', 'fields'];
//     excludeFields.forEach(field => delete queryObj[field]);

//     // Filtering
//     let query = Book.find(queryObj);

//     // Sorting
//     if (req.query.sort) {
//         const sortBy = req.query.sort.split(',').join(' ');
//         query = query.sort(sortBy); // ?sort=publishedYear,-name
//     } else {
//         query = query.sort('-createdAt');
//     }

//     // Pagination
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     query = query.skip(skip).limit(limit);

//     const books = await query;
//     res.status(200).json({
//         count: books.length,
//         page,
//         data: books,
//     });
// });