const express = require("express");
const { authMiddleware } = require("../middlewares/Authentication");
const { addProduct, updateProduct, deleteProduct, getSingleProduct, getAllProducts } = require("../controllers/productPageController");
const router = express.Router();




router.post("/add", authMiddleware, addProduct);
router.post("/update/:id", authMiddleware, updateProduct); 
router.delete("/delete/:id", authMiddleware, deleteProduct); 
router.get("/:id", authMiddleware, getSingleProduct); 
router.get("/", authMiddleware, getAllProducts); 

module.exports = router;
