const express = require("express");
const productController = require("../controllers/productController");
const { validateToken } = require("../authUtils");
const router = express.Router();

router.post("/getAllProducts", validateToken,productController.getAllProducts);
router.post("/getProductByUserId",validateToken, productController.getProductByUserId);
router.get("/getProductById/:id",validateToken, productController.getProductById);
router.post("/addProduct", validateToken,productController.addProduct);
router.put("/updateProduct/:id",validateToken, productController.updateProduct);
router.delete("/deleteProduct/:id",validateToken, productController.deleteProduct);

module.exports = router;
