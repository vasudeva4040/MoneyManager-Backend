const {
    dynamoDbDocClient,
    transactionTable,
  } = require("../config/dynamoDB.config");
  
  // Helper function to create a DynamoDB service object
  const createDynamoDbService = () => {
    const getDynamoDbDocClient = () => dynamoDbDocClient;
  
    const getTableName = () => transactionTable;
  
    /* This function will get the transaction amount per category in the given time range
     * @params
     *
     * @userId: string - UserId,
     * @startTime: string - Starting Time of the time range
     * @endTime: string - Ending Time of the time range
     * @transactionType: string - Indicates whether it is an expense or income transaction.
     */
    const updateExpense = async (userId, timestamp, expenseData) => {
      try {
        // Step 1: Get the item with the matching userId and timestamp
        const getParams = {
          TableName: "transactions",
          Key: {
            userId: Number(userId),
            timeStamp: timestamp,
          },
        };
  
        const getResult = await dynamoDb.get(getParams).promise();
  
        if (!getResult.Item) {
          throw new Error("No matching expense found");
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
          TableName: "transactions",
          Key: {
            userId: Number(userId),
            timeStamp: timestamp,
          },
          UpdateExpression: `set ${updateExpressionParts.join(", ")}`,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: "ALL_NEW",
        };
  
        const updateResult = await dynamoDb.update(updateParams).promise();
        return updateResult.Attributes;
      } catch (error) {
        console.error("Error updating expense:", error);
        throw error;
      }
    };
  
    const deleteExpense = async (userId, timestamp) => {
      const params = {
        TableName: "transactions",
        Key: {
          userId: Number(userId),
          timeStamp: timestamp,
        },
      };
  
      await dynamoDb.delete(params).promise();
    };
  
    return {
      getDynamoDbDocClient,
      updateExpense,
      deleteExpense
    };
  };
  
  module.exports = createDynamoDbService;  