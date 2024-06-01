//This file defines the routes for your application and maps them to the corresponding controller functions.

const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');

// Define protected routes
router.get('/pieChart/getTransactionAmountByCategory', Controller.getTransactionAmountByCategory);
router.get('/transactions', Controller.getTransactionsList);

module.exports = router;