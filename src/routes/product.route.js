import express from "express";
import { createProduct ,getProducts,getProductsById,getProductsByIdAndUpdate,getProductsByIdAndDelete} from "../controllers/product.controller.js";

const productRouter = express.Router();


productRouter.route("/").post(createProduct).get(getProducts);

productRouter.route("/:id").get(getProductsById).put(getProductsByIdAndUpdate).delete(getProductsByIdAndDelete)

export {productRouter}