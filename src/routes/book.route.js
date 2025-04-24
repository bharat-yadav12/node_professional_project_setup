import { createBook ,getAllBooks,updateBook,deleteBook} from "../controllers/book.controller.js";

import { Router } from "express";

const router = Router();


router.route('/')
.post(createBook)
.get(getAllBooks);

router.route('/:id')
.put(updateBook)
.delete(deleteBook);



export default router;