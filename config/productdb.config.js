const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.region,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

// Create a DynamoDB client
const dynamoDbClient = new AWS.DynamoDB();

// Create a DynamoDB document client
const dynamoDbDocClient = new AWS.DynamoDB.DocumentClient({ region: process.env.region });

const tableName = 'sample-test-table'

module.exports = {
  dynamoDbClient,
  dynamoDbDocClient,
  tableName
};