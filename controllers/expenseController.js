// controllers/expenseController.js
const dynamoDbService = require('../services/transactionsDBService');

const updateExpense = async (req, res) => {
  const { userId, timestamp } = req.params;
  const expenseData = req.body;

  try {
    const updatedExpense = await dynamoDbService.updateExpense(userId, timestamp, expenseData);
    res.json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
};
const deleteExpense = async (req, res) => {
    const { userId, timestamp } = req.params;
  
    try {
      await dynamoDbService.deleteExpense(userId, timestamp);
      res.status(200).send('Expense deleted successfully');
    } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(500).send('Failed to delete expense');
    }
  };

module.exports = {
  updateExpense,
  deleteExpense
};
