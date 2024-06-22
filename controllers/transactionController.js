//This file contains the logic for handling incoming HTTP requests and responding with the appropriate data. It interacts with the model and service layers to fetch or manipulate data in DynamoDB.
const createDynamoDbService = require("../services/transactionsDBService");

const dynamoDbService = createDynamoDbService();

const getTransactionAmountByCategory = async (req, res) => {
  try {
    const categories = await dynamoDbService.getTransactionAmountByCategory(
      req.query.user,
      req.query.startTime,
      req.query.endTime,
      req.query.transactionType
    );
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

const getTransactionsList = async (req, res) => {
    try {
        const transactions = await dynamoDbService.getTransactionsList(
          req.query.user,
          req.query.startTime,
          req.query.endTime,
        );
        res.status(200).json(transactions);
      } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error });
      }
};

module.exports = {
  getTransactionAmountByCategory,
  getTransactionsList,
};
