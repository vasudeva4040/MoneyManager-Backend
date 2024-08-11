// controllers/expenseController.js
const createDynamoDbService = require('../services/expenseService');

dynamoDbService = createDynamoDbService()

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
    try {
      const expense = req.body;
      const deletedExpense = await dynamoDbService.deleteExpense(expense)
      res.status(200).json(deletedExpense);
    } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(500).send('Failed to delete expense');
    }
  };

module.exports = {
  updateExpense,
  deleteExpense
};
