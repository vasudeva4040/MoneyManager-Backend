const { dynamoDbClient } = require('../config/dynamoDB.config')
const createDynamoDbService = require('../services/transactionsDBService')

const dynamoDbService = createDynamoDbService()

const getRecentTransactions = async (req,res) => {
    try{
        const user = req.query.user
        const recents =  await dynamoDbService.getRecentTransactions(user)
        res.status(200).json(recents)
    }catch (error) {
        res.status(500).json({ message: "Error fetching details", error })
    }
}
const addNewExpense = async (req,res) => {
    try{
        const { user,amount,category,description } = req.body
        if (!user || !amount || !category || !description){
            return res.status(400).json(({message:'Missing fields'}))
        }
        const expense = req.body
        const { updatedBalance,newItem } = await dynamoDbService.addNewExpense(expense)
        res.status(200).json({newItem,updatedBalance})
    }catch (err) {
        console.log('Error',err)
        res.status(500).json({ message: "Error", err })
    }
}
const addIncome = async (req,res) => {
    try{
        const income = req.body
        const updatedBalance = await dynamoDbService.addIncome(income)
        res.status(200).json(updatedBalance)
    }catch (err){
        console.log('error',err)
        res.status(400).json({ message:'Error',err})
    }
}
module.exports = {
    getRecentTransactions,
    addNewExpense,
    addIncome
}