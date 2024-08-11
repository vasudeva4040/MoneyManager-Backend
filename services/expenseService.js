const {
    dynamoDbDocClient,
    transactionTable,
  } = require("../config/dynamoDB.config");
  
  const createDynamoDbService = () => {
    const getDynamoDbDocClient = () => dynamoDbDocClient;
  
    const getTableName = () => transactionTable
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
  
        const getResult = await dynamoDbDocClient.get(getParams).promise();
  
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
          TableName: getTableName(),
          Key: {
            userId: Number(userId),
            timeStamp: timestamp,
          },
          UpdateExpression: `set ${updateExpressionParts.join(", ")}`,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: "ALL_NEW",
        };
  
        const updateResult = await dynamoDbDocClient.update(updateParams).promise();
        return updateResult.Attributes;
      } catch (error) {
        console.error("Error updating expense:", error);
        throw error;
      }
    };
  
    const deleteExpense = async (expense) => {
        const params = {
          TableName: getTableName(),
          Key: {
            userId: Number(expense.user),
            timeStamp: expense.timeStamp
          }
        }
        try{
          await dynamoDbDocClient.delete(params).promise()
          return "deleted"
        }catch(err){
            console.log('Error:',err)
            throw(err)
          }
    }
  
    return {
      getDynamoDbDocClient,
      updateExpense,
      deleteExpense
    };
  };
  
  module.exports = createDynamoDbService;  