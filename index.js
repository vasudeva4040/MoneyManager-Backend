const express = require('express')
const app = express();
const createDynamoDbService = require('./services/dynamodbService');

const dynamoDbService = createDynamoDbService();

dynamoDbService.putItem({
    id: 'item123',
    name: 'Example Item',
    price: 19.99,
    tags: ['example', 'product']
  });

async function fetchItem() {
    try {
      const value = await dynamoDbService.getItem({ id: 'item123' });
      console.log(value);
    } catch (err) {
      console.error('Error retrieving item:', err);
    }
  }
  
fetchItem()

app.get('/', (req,res) => {
    res.send("Hello World!!");
})

app.listen(5000, () => {
    console.log('Server is running on port 3000');
})