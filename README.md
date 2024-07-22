**User APIs:**

get: http://localhost:3000/api/user?userId=2  (to get user details by userid)
put: http://localhost:3000/api/user/update?userId=2  (Update user details by userId)
body:
{
    "passwordHash": "Hell",
    "userName": "robinthebank",
    "createDate": "2024-06-09",
    "currentBalance": 3500,
    "email": "vasudeva4040@gmail.com",
    "userId": 2
}
post: http://localhost:3000/api/newuser  (add new user details)
body:
{
    "passwordHash": "hello",
    "userName": "wirtz",
    "currentBalance": "5000",
    "email": "sample@gmail.com",
    "userId": "5"
}
delete: http://localhost:3000/api/user/delete?userId=3  (delete user)

**HomePage APIs:**

get: http://localhost:3000/api/recents?user=1  (get recent transactions to display on home)
get: http://localhost:3000/api/balance?user=1  (get balance)
put: http://localhost:3000/api/income  (change income in user table and display for balance)
body:
{
    "user": "1",
    "amount": "2000"
}
post: http://localhost:3000/api/expense  (add new expense)
body:
{
    "user": "2",
    "amount": "2500",
    "category": "Food",
    "description": "Biryanis"
}

**PieChart APIs:**

get: http://localhost:3000/api/pieChart/getTransactionAmountByCategory?user=1&startTime=2024-06&endTime=2024-07&transactionType=Expense  (We need to get all the categories that are present for the User.
Get the transaction amount for the selected time range)
get: http://localhost:3000/api/transactions?user=1&startTime=2024-07-01&endTime=2024-08-01  (Get the list of transactions for the given time range)
