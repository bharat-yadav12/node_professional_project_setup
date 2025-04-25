//import { Author } from "../models/Author.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Author } from "../models/Authors.model.js";

const createAuthor = asyncHandler(async(req,res,next)=>{
    const { name, country, age } = req.body;
    const author = await Author.create({ name, country, age });
    res.status(201).json(author);


    //create many records using postman
    // const author = await Author.insertMany(req.body)
    // res.status(201).json({
    //     success: true,
    //     message: "Author created successfully",
    //     author
    // })
})
// const getAllAuthors = asyncHandler(async(req, res, next)=>{
//     console.log("req.query", req.query)
//     const authors = await Author.find();
//     res.status(200).json(authors)
// })



const getAllAuthors = asyncHandler(async(req,res,next)=>{
    const {page = 1,limit = 10,sort,search,country} = req.query;
    console.log("req.query", req.query)
    let sortOrder = sort ? ( sort.charAt(0) === '-' ? {[sort.slice(1)]:-1}:{[sort]:1} ) :{age:1};
    let query = {};
    if(search){
        query = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { country: { $regex: search, $options: 'i' } }
            ]
        };
    }
    if(country){
        query.country = country;
    }
   
    const pageNum = Number(page);
    const limitNum = Number(limit);
   
    //const authors = await Author.find({country:country}).sort({age:-1}).skip((pageNum-1)*limitNum).limit(limitNum)
    const authors = await Author.find(query).sort(sortOrder).collation({ locale: 'en', strength: 2 }).skip((pageNum-1)*limitNum).limit(limitNum)
    const total = await Author.countDocuments();
    const totalPages = Math.ceil(total/limitNum);
    if(pageNum > totalPages) return res.status(404).json({message: "Page not found"})
    res.status(200).json({
        total,
        totalPages,
        currentPage: pageNum,
        page: pageNum,
        limit: limitNum,
        authors
    });
})

const getAuthorById = asyncHandler(async(req,res,next)=>{
    const author = await Author.findById(req.params.id);
    res.status(200).json(author);
})

const getAuthorByIdAndUpdate = asyncHandler(async(req,res,next)=>{
    const author = await Author.findByIdAndUpdate(req.params.id,req.body,{new: true});
    res.status(200).json(author);
})

const getAuthorByIdAndDelete = asyncHandler(async(req,res,next)=>{
    const author = await Author.findByIdAndDelete(req.params.id);
    res.status(200).json(author);
})



export {createAuthor,getAllAuthors,getAuthorById,getAuthorByIdAndUpdate,getAuthorByIdAndDelete}