//This file contains the logic for handling incoming HTTP requests and responding with the appropriate data. It interacts with the model and service layers to fetch or manipulate data in DynamoDB.
const createDynamoDbService = require('../services/dynamodbService');

const dynamoDbService = createDynamoDbService();


const getCategories = async (req, res) => {
  try {
    const categories = await dynamoDbService.queryCategories(req.query.user, req.query.startTime, req.query.endTime);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

const transactionAmountByCategory = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item', error });
  }
};

const getTransactions = async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: 'Error adding item', error });
  }
};

module.exports = {
    getCategories,
    transactionAmountByCategory,
    getTransactions,
};
