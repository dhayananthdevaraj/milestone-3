const express = require("express");
const productController = require("../controllers/productController");
const { validateToken } = require("../authUtils");
const router = express.Router();

router.post("/getAllProducts", validateToken,productController.getAllProducts);
router.post("/getProductByUserId",validateToken, productController.getProductByUserId);
router.get("/getProductById/:id", productController.getProductById);
router.post("/addProduct", productController.addProduct);
router.put("/updateProduct/:id", productController.updateProduct);
router.delete("/deleteProduct/:id", productController.deleteProduct);

module.exports = router;
