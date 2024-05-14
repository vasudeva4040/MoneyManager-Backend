const { dynamoDbDocClient, tableName } = require('../config/dynamodb.config');

// Helper function to create a DynamoDB service object
const createDynamoDbService = () => {
  const getDynamoDbDocClient = () => dynamoDbDocClient;

  const getTableName = () => tableName;

  const putItem = async (item) => {
    const params = {
      TableName: getTableName(),
      Item: item
    };

    try {
      await dynamoDbDocClient.put(params).promise();
    } catch (err) {
      console.error('Error putting item:', err);
      throw err;
    }
  };

  const getItem = async (key) => {
    const params = {
      TableName: getTableName(),
      Key: key
    };

    try {
      const { Item } = await dynamoDbDocClient.get(params).promise();
      return Item;
    } catch (err) {
      console.error('Error getting item:', err);
      throw err;
    }
  };

  return {
    getDynamoDbDocClient,
    getTableName,
    putItem,
    getItem
  };
};

module.exports = createDynamoDbService;