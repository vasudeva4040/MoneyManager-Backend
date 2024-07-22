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
  const getTransactionAmountByCategory = async (
    userId,
    startTime,
    endTime,
    transactionType
  ) => {
    try {
      const params = {
        TableName: getTableName(),
        KeyConditionExpression:
          "userId = :userId AND #timeStamp BETWEEN :startTime AND :endTime",
        ExpressionAttributeNames: {
          "#timeStamp": "timeStamp",
        },
        ExpressionAttributeValues: {
          ":userId": Number(userId),
          ":startTime": startTime,
          ":endTime": endTime,
        },
      };
      const data = await dynamoDbDocClient.query(params).promise();
      const categories = {}; // Create a new Map
      data.Items.forEach((item) => {
        if (item.transactionType == transactionType) {
          if (!categories[item.category]) {
            categories[item.category] = Number(item.amount); // Use set() to assign key-value pairs
          } else {
            categories[item.category] += Number(item.amount);
          }
        }
      });
      //{ 'Food' => 2000, 'Travel' => 1500, 'Movies' => 200 }
      return categories;
    } catch (error) {
      console.error("Unable to query:", error);
      throw error;
    }
  };

  const getTransactionsList = async (userId, startTime, endTime) => {
    try {
      const params = {
        TableName: getTableName(),
        KeyConditionExpression:
          "userId = :userId AND #timeStamp BETWEEN :startTime AND :endTime",
        ExpressionAttributeNames: {
          "#timeStamp": "timeStamp",
        },
        ExpressionAttributeValues: {
          ":userId": Number(userId),
          ":startTime": startTime,
          ":endTime": endTime,
        },
      };
      const data = await dynamoDbDocClient.query(params).promise();
      //{
      //   category: 'Salary',
      //   amount: '2500',
      //   description: '',
      //   transactionType: 'Income',
      //   userId: '123',
      //   timestamp: '2022-06-01T00:00:00'
      // }
      return data.Items;
    } catch (error) {
      console.error("Unable to query:", error);
      throw error;
    }
  };


  return {
    getDynamoDbDocClient,
    getTransactionAmountByCategory,
    getTransactionsList
  };
};

module.exports = createDynamoDbService;
