// const productService = require('../services/productService');

// const createProduct = async (req, res) => {
//   try {
//     const productData = req.body;
//     const product = await productService.createProduct(productData);
//     res.status(201).json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getAllProducts = async (req, res) => {
//   try {
//     const products = await productService.getAllProducts();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getProductByDate = async (req, res) => {
//   try {
//     const date = req.params.date;
//     const product = await productService.getProductByDate(date);
//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const updateProductByDate = async (req, res) => {
//   try {
//     const date = req.params.date;
//     const productData = req.body;
//     const product = await productService.updateProductByDate(date, productData);
//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const deleteProductByDate = async (req, res) => {
//   try {
//     const date = req.params.date;
//     const product = await productService.deleteProductByDate(date);
//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }
//     res.json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   createProduct,
//   getAllProducts,
//   getProductByDate,
//   updateProductByDate,
//   deleteProductByDate
// };
