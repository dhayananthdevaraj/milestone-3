const Product = require('../models/productModel');

// const getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const getAllProducts = async (req, res) => {
    try {
      const sortValue = req.body.sortValue || 1; // Default to ascending order if not provided
      const search = req.body.searchValue || ''; // Default to empty string if not provided
      const searchRegex = new RegExp(search, 'i'); // Case-insensitive search regex
  
      const products = await Product.find({ product: searchRegex })
        .sort({ price: parseInt(sortValue) });
  
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("came in getbyid");
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: `Product not found` });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getProductByUserId = async (req, res) => {
  try {
    const sortValue = req.body.sortValue || 1; // Default to ascending order if not provided
    const search = req.body.searchValue || ''; // Default to empty string if not provided
    const searchRegex = new RegExp(search, 'i'); // Case-insensitive search regex

    const { userId } = req.body.userId;
    console.log("came in getbyid");
    const product = await Product.findById({userId}).find({ product: searchRegex })
    .sort({ price: parseInt(sortValue) });;
    if (!product) {
      return res.status(404).json({ message: `Products not found for the provided userId` });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json({ message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: `Product not found` });
    }
    res.status(200).json({ message: 'Product updated successfully'});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: `Product not found` });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductByUserId
};
