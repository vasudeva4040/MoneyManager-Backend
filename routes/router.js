const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const homeController = require('../controllers/homeController');
const transactionController = require('../controllers/transactionController');
const userController = require("../controllers/userController");


router.get('/balance',homeController.getBalance)
router.get('/recents',homeController.getRecentTransactions);
router.post('/expense',homeController.addNewExpense);
router.post('/income',homeController.addIncome);

router.get('/pieChart/getTransactionAmountByCategory', transactionController.getTransactionAmountByCategory);
router.get('/transactions', transactionController.getTransactionsList);

router.put('/expenses/:userId/:timestamp', expenseController.updateExpense);
router.delete('/deleteExpense', expenseController.deleteExpense);

router.get('/user', userController.getUserDetails);
router.put('/user/update', userController.updateUserDetails);
router.delete('/user/delete',userController.deleteUser)
router.post('/newuser', userController.createUser);

module.exports = router;
