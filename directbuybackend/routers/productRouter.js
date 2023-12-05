const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();

router.post("/getAllProducts", productController.getAllProducts);
router.post("/getLoanApplicationById", productController.getProductByUserId);
router.get("/getProductById/:id", productController.getProductById);
router.post("/addProduct", productController.addProduct);
router.put("/updateProduct/:id", productController.updateProduct);
router.delete("/deleteProduct/:id", productController.deleteProduct);

module.exports = router;
