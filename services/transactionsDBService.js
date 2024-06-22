const {
  dynamoDbDocClient,
  transactionsTable,
} = require("../config/dynamoDB.config");

// Helper function to create a DynamoDB service object
const createDynamoDbService = () => {
  const getDynamoDbDocClient = () => dynamoDbDocClient;

  const getTableName = () => transactionsTable;

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

  const putItem = async (item) => {
    const params = {
      TableName: getTableName(),
      Item: item,
    };

    try {
      await dynamoDbDocClient.put(params).promise();
    } catch (err) {
      console.error("Error putting item:", err);
      throw err;
    }
  };

  const getItem = async (key) => {
    const params = {
      TableName: getTableName(),
      Key: key,
    };

    try {
      const { Item } = await dynamoDbDocClient.get(params).promise();
      return Item;
    } catch (err) {
      console.error("Error getting item:", err);
      throw err;
    }
  };

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

  const getRecentTransactions = async (userId) => {
    try {
      const params = {
        TableName: getTableName(),
        // Key:{
        //     userId:Number(userId)
        // },
        KeyConditionExpression: "userId=:userId",
        ExpressionAttributeValues: {
          ":userId": Number(userId),
        },
        ScanIndexForward: false,
        Limit: 2,
      };
      const data = await dynamoDbDocClient.query(params).promise();
      return data.Items;
    } catch (err) {
      console.log("Error:", err);
      throw err;
    }
  };

  const addNewExpense = async (item) => {
    const newItem = {
        'userId':Number(item.user),
        'amount':Number(item.amount),
        'category':item.category,
        'description':item.description,
        'timeStamp':timeStamp()
    }
    const params = {
        TableName:getTableName(),
        Item:newItem
    }
    const updateParams = {
        Key:{
            userId:Number(item.user)
        },
        TableName:getUserTable(),
        UpdateExpression:"SET #balance = #balance - :amount",
        ExpressionAttributeNames:{
            '#balance':'currentBalance'
        },
        ExpressionAttributeValues:{
            ':amount':Number(item.amount)
        },
        ReturnValues:"UPDATED_NEW"
    }
    try{
        await dynamoDbDocClient.put(params).promise()
        const updatedBalance = await dynamoDbDocClient.update(updateParams).promise()
        return { updatedBalance, newItem }
    }catch (err){
        console.log("error",err)
        throw(err)
    }
}

const addIncome = async (item) => {
  const updateParams = {
      Key:{
          userId:Number(item.user)
      },
      TableName:getUserTable(),
      UpdateExpression:"SET #balance = #balance + :income",
      ExpressionAttributeNames:{
          '#balance':'currentBalance'
      },
      ExpressionAttributeValues:{
          ':income':Number(item.amount)
      },
      ReturnValues:"UPDATED_NEW"
  }
  try{
      const updatedBalance = await dynamoDbDocClient.update(updateParams).promise()
      return updatedBalance
  }catch (err){
      console.log('error',err)
      throw(err)
  }
}

  return {
    getDynamoDbDocClient,
    getTableName,
    putItem,
    getItem,
    getTransactionAmountByCategory,
    getTransactionsList,
    updateExpense,
    deleteExpense,
    getRecentTransactions,
    addNewExpense,
    addIncome,
    


  };
};

module.exports = createDynamoDbService;
