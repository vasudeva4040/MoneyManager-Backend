const { dynamoDbDocClient, tableName } = require('../config/dynamodb.config');

// Helper function to create a DynamoDB service object
const createDynamoDbService = () => {
  const getDynamoDbDocClient = () => dynamoDbDocClient;

  const getTableName = () => tableName;

  const queryCategories = async (userId, startTime, endTime) => {
    try {
      const params = {
        TableName: getTableName(),
        KeyConditionExpression: 'userId = :userId AND #timestamp BETWEEN :startTime AND :endTime',
        ExpressionAttributeNames: {
          '#timestamp': 'timestamp'
        },
        ExpressionAttributeValues: {
          ':userId': userId,
          ':startTime': startTime,
          ':endTime': endTime
        },
        ProjectionExpression: 'category'
      };
  
      const data = await dynamoDbDocClient.query(params).promise();
      const categories = data.Items.map(item => item.category);
      console.log(categories); // Log categories here for testing
      return categories;
    } catch (error) {
      console.error("Unable to query:", error);
      throw error;
    }
  };
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
    getItem,
    queryCategories
  };
};

module.exports = createDynamoDbService;