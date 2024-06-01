const express = require('express')
const app = express();
const createDynamoDbService = require('./services/dynamodbService');
const route = require('./routes/route')

const dynamoDbService = createDynamoDbService();

app.use('/api', route);

app.get('/', (req,res) => {
    res.send("Hello World!!");
})

app.listen(5000, () => {
    console.log('Server is running on port 5000');
})