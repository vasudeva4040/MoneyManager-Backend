const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const homeController = require('../controllers/homeController');
const transactionController = require('../controllers/transactionController');
const userController = require("../controllers/userController");



router.put('/expenses/:userId/:timestamp', expenseController.updateExpense);
router.delete('/expenses/:userId/:timestamp', expenseController.deleteExpense);

router.get('/recents',homeController.getRecentTransactions);
router.post('/expense',homeController.addNewExpense);
router.put('/income',homeController.addIncome);

router.get('/pieChart/getTransactionAmountByCategory', transactionController.getTransactionAmountByCategory);
router.get('/transactions', transactionController.getTransactionsList);

router.get('/user/', userController.getUserDetails);
router.patch('/user/update/', userController.updateUserDetails);
router.delete('/user/delete/',userController.deleteUser)
router.patch('/newuser/', userController.createUser);

module.exports = router;
