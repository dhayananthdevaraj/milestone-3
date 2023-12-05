const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();

router.get("/getAllProducts", productController.getAllProducts);
router.get("/getProductById/:id", productController.getProductById);
router.post("/addProduct", productController.addProduct);
router.put("/updateProduct/:id", productController.updateProduct);
router.delete("/deleteProduct/:id", productController.deleteProduct);

module.exports = router;
