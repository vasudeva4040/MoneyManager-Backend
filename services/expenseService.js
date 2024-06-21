// services/dynamoDbService.js
const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  region: process.env.AWS_REGION || 'eu-north-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const updateExpense = async (userId, timestamp, expenseData) => {
  try {
    // Step 1: Get the item with the matching userId and timestamp
    const getParams = {
      TableName: 'transactions',
      Key: {
        userId: Number(userId),
        timeStamp: timestamp,
      },
    };

    const getResult = await dynamoDb.get(getParams).promise();

    if (!getResult.Item) {
      throw new Error('No matching expense found');
    }

    // Step 2: Build the update expression dynamically
    const updateExpressionParts = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    for (const key of Object.keys(expenseData)) {
      updateExpressionParts.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = expenseData[key];
    }

    const updateParams = {
      TableName: 'transactions',
      Key: {
        userId: Number(userId),
        timeStamp: timestamp,
      },
      UpdateExpression: `set ${updateExpressionParts.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    };

    const updateResult = await dynamoDb.update(updateParams).promise();
    return updateResult.Attributes;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

const deleteExpense = async (userId, timestamp) => {
    const params = {
      TableName: 'transactions',
      Key: {
        userId: Number(userId),
        timeStamp: timestamp
      }
    };
  
    await dynamoDb.delete(params).promise();
  };
module.exports = {
  updateExpense,
  deleteExpense
};
