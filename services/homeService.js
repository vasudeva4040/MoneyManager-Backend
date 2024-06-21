const {dynamoDbDocClient,tableName,userTable } = require('../config/homedb.config')
const {timeStamp} = require('../timeStamp')

const createDynamoDbService = () => {
    const getDynamoDbClient = () => dynamoDbDocClient

    const getTableName = () => tableName
    const getUserTable = () => userTable
    const getRecentTransactions = async (userId) => {
        try {
            const params = {
                TableName: getTableName(),
                // Key:{
                //     userId:Number(userId)
                // },
                KeyConditionExpression:
                    "userId=:userId",
                ExpressionAttributeValues:{
                    ":userId":Number(userId)
                },
                ScanIndexForward:false,
                Limit:2
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
        getDynamoDbClient,
        getTableName,
        getRecentTransactions,
        addNewExpense,
        addIncome
    }
}

module.exports = createDynamoDbService
