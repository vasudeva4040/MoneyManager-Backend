//This file defines the routes for your application and maps them to the corresponding controller functions.

const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');

// Define protected routes
router.get('/pieChart/categories', Controller.getCategories);
router.get('/pieChart/transactionAmountByCategory', Controller.transactionAmountByCategory);
router.get('/transactions', Controller.getTransactions);

module.exports = router;