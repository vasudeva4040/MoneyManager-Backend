# User APIs

## Get User Details
- **Method:** GET
- **Endpoint:** `http://localhost:3000/api/user?userId=2`
- **Description:** Retrieve user details by user ID.

## Check User
- **Method:** GET
- **Endpoint:** `http://localhost:3000/api/user/check?userInput=Test&passwordHash=Test`
- **Description:** Checks whether the user exists or not

## Update User Details
- **Method:** PUT
- **Endpoint:** `http://localhost:3000/api/user/update?userId=2`
- **Body:**
    ```json
    {
        "passwordHash": "Hell",
        "userName": "robinthebank",
        "createDate": "2024-06-09",
        "currentBalance": 3500,
        "email": "vasudeva4040@gmail.com",
        "userId": 2
    }
    ```
- **Description:** Update user details by user ID.

## Add New User
- **Method:** POST
- **Endpoint:** `http://localhost:3000/api/newuser`
- **Body:**
    ```json
    {
        "passwordHash": "hello",
        "userName": "wirtz",
        "currentBalance": "5000",
        "email": "sample@gmail.com",
        "userId": "5"
    }
    ```
- **Description:** Add new user details.

## Delete User
- **Method:** DELETE
- **Endpoint:** `http://localhost:3000/api/user/delete?userId=3`
- **Description:** Delete user by user ID.

# HomePage APIs

## Get Recent Transactions
- **Method:** GET
- **Endpoint:** `http://localhost:3000/api/recents?user=1`
- **Description:** Get recent transactions to display on home.

## Get Balance
- **Method:** GET
- **Endpoint:** `http://localhost:3000/api/balance?user=1`
- **Description:** Get balance for the user.

## Change Income
- **Method:** PUT
- **Endpoint:** `http://localhost:3000/api/income`
- **Body:**
    ```json
    {
        "user": "1",
        "amount": "2000"
    }
    ```
- **Description:** Change income in user table and display for balance.

## Add New Expense
- **Method:** POST
- **Endpoint:** `http://localhost:3000/api/expense`
- **Body:**
    ```json
    {
        "user": "2",
        "amount": "2500",
        "category": "Food",
        "description": "Biryanis"
    }
    ```
- **Description:** Add new expense.

# PieChart APIs

## Get Transaction Amount by Category
- **Method:** GET
- **Endpoint:** `http://localhost:3000/api/pieChart/getTransactionAmountByCategory?user=1&startTime=2024-06&endTime=2024-07&transactionType=Expense`
- **Description:** Get all categories present for the user and the transaction amount for the selected time range.

## Get List of Transactions
- **Method:** GET
- **Endpoint:** `http://localhost:3000/api/transactions?user=1&startTime=2024-07-01&endTime=2024-08-01`
- **Description:** Get the list of transactions for the given time range.
