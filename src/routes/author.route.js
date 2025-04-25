import express from "express";
import { createAuthor,getAllAuthors,getAuthorById,getAuthorByIdAndUpdate,getAuthorByIdAndDelete} from "../controllers/author.controller.js";

const authorRouter = express.Router();


authorRouter.route('/').post(createAuthor).get(getAllAuthors)

authorRouter.route('/:id').get(getAuthorById).put(getAuthorByIdAndUpdate).delete(getAuthorByIdAndDelete)

export {authorRouter}


