const AWS = require('aws-sdk')

AWS.config.update({
    region: process.env.region,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

const dynamoDbClient = new AWS.DynamoDB()

const dynamoDbDocClient = new AWS.DynamoDB.DocumentClient({ region: process.env.region });

const tableName = 'transactions';
const userTable = 'user'
// let region = process.env.region;
// console.log(region);

module.exports = {
    dynamoDbClient,
    dynamoDbDocClient,
    tableName,
    userTable
};
