const {dynamoDbDocClient,transactionTable,userTable } = require('../config/dynamoDB.config')
const {timeStamp} = require('../util/timeStamp')

const createDynamoDbService = () => {
    const getDynamoDbClient = () => dynamoDbDocClient

    const getTransactionTable = () => transactionTable
    const getUserTable = () => userTable

    const getBalance = async (userId) => {
        try{
            const params = {
                TableName: getUserTable(),
                KeyConditionExpression:
                    "userId=:userId",
                ExpressionAttributeValues:{
                    ":userId":Number(userId)
                }
            }
            const data = await dynamoDbDocClient.query(params).promise()
            return data.Items
        }catch(err){
            console.log('Error:',err)
            throw(err)
        }
    }
    const getRecentTransactions = async (userId) => {
        try {
            const params = {
                TableName: getTransactionTable(),
                // Key:{
                //     userId:Number(userId)
                // },
                KeyConditionExpression:
                    "userId=:userId",
                ExpressionAttributeValues:{
                    ":userId":Number(userId)
                },
                ScanIndexForward:false,
                Limit:10
            }
            const data = await dynamoDbDocClient.query(params).promise()
            return data.Items
        }catch(err){
            console.log("Error:", err)
            throw(err)
        }
    }
    const addNewExpense = async (item) => {
        const newItem = {
            'userId':Number(item.user),
            'amount':Number(item.amount),
            'category':item.category,
            'description':item.description,
            'transactionType':'Expense',
            'timeStamp':timeStamp()
        }
        const params = {
            TableName:getTransactionTable(),
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
        const newItem = {
            'userId':Number(item.user),
            'amount':Number(item.amount),
            'category':item.category,
            'description':item.description,
            'transactionType':'Income',
            'timeStamp':timeStamp()
        }
        const params = {
            TableName:getTransactionTable(),
            Item:newItem
        }
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
            await dynamoDbDocClient.put(params).promise()
            const updatedBalance = await dynamoDbDocClient.update(updateParams).promise()
            return updatedBalance
        }catch (err){
            console.log('error',err)
            throw(err)
        }
    }
    return {
        getDynamoDbClient,
        getBalance,
        getRecentTransactions,
        addNewExpense,
        addIncome
    }
}

module.exports = createDynamoDbService