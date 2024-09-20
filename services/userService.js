const { dynamoDbDocClient, userTable,transactionTable } = require("../config/dynamoDB.config");
const { timeStamp } = require("../util/timeStamp");

const createDynamoDbService = () => {
  const getDynamoDbClient = () => dynamoDbDocClient;

  const getTableName = () => userTable;
  const getTransactionsTableName = () => transactionTable;

  const getUserDetails = async (userId) => {
    try {
      const params = {
        TableName: getTableName(),
        KeyConditionExpression: "userId=:userId",
        ExpressionAttributeValues: {
          ":userId": Number(userId),
        },
      };
      const data = await dynamoDbDocClient.query(params).promise();
      return data.Items[0];
    } catch (err) {
      console.log("Error:", err);
      throw err;
    }
  };

  const getUserDetailsFromEmailOrUserName = async (userInput, passwordHash) => {
    try {
      const params = {
        TableName: getTableName(),
        FilterExpression:
          "(email = :userInput AND passwordHash = :passwordHash) OR (userName = :userInput AND passwordHash = :passwordHash)",
        ExpressionAttributeValues: {
          ":userInput": String(userInput),
          ":passwordHash": String(passwordHash),
        },
        Limit: 10,
      };

      const data = await dynamoDbDocClient.scan(params).promise();
      console.log("Data from DynamoDB table is", data);
      return data.Items.length > 0 ? data.Items[0] : {}; 
    } catch (err) {
      console.log("Error:", err);
      throw err;
    }
  };

  const deleteUserDetails = async (userId) => {
    try {
      const params = {
        TableName: getTableName(),
        Key: {
          userId: Number(userId),
        },
      };
      await dynamoDbDocClient.delete(params).promise();
      // to delete all transactions
      const transactionQueryParams = {
        TableName: getTransactionsTableName(),
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": Number(userId),
        },
      };
      const transactionsData = await dynamoDbDocClient.query(transactionQueryParams).promise();

      // Delete each transaction
      const deletePromises = transactionsData.Items.map(async (transaction) => {
        const deleteTransactionParams = {
          TableName: getTransactionsTableName(),
          Key: {
            userId: transaction.userId, // Partition key
            timeStamp: transaction.timeStamp, // Sort key
          },
        };
        return dynamoDbDocClient.delete(deleteTransactionParams).promise();
      });

      await Promise.all(deletePromises);
      return "sad to let you go";
    } catch (err) {
      console.log("Error:", err);
      throw err;
    }
  };
  const updateUserDetails = async (userId, updates) => {
    try {
      const params = {
        TableName: getTableName(),
        Key: {
          userId: Number(userId),
        },
        UpdateExpression:
          "set email=:email, passwordHash=:passwordHash, userName=:userName",
        ExpressionAttributeValues: {
          ":email": updates.email,
          ":passwordHash": updates.passwordHash,
          ":userName": updates.userName,
        },
        ReturnValues: "ALL_NEW",
      };
      const data = await dynamoDbDocClient.update(params).promise();
      return data.Attributes;
    } catch (err) {
      console.log("Error:", err);
      throw err;
    }
  };

  const createUserDetails = async (item) => {
    const newItem = {
      userId: Number(item.userId),
      createDate: timeStamp(),
      currentBalance: Number(item.currentBalance),
      email: String(item.email),
      passwordHash: String(item.passwordHash),
      userName: String(item.userName),
    };
    const params = {
      TableName: getTableName(),
      Item: newItem,
    };
    try {
      await dynamoDbDocClient.put(params).promise();
      return newItem;
    } catch (err) {
      console.log("error", err);
      throw err;
    }
  };

  return {
    getUserDetailsFromEmailOrUserName,
    getDynamoDbClient,
    getTableName,
    getUserDetails,
    updateUserDetails,
    deleteUserDetails,
    createUserDetails,
  };
};

module.exports = createDynamoDbService;
