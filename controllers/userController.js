const createDynamoDbService = require("../services/userService");

const dynamoDbService = createDynamoDbService();

const getUserDetails = async (req, res) => {
  try {
    const userId = req.query.userId;
    const userDetails = await dynamoDbService.getUserDetails(userId);
    if (!userDetails) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(userDetails);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details", error });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const userId = req.query.userId
    // const { createDate, currentBalance, email, passwordHash, userName } =
    //   req.body
    const updatedUser = await dynamoDbService.updateUserDetails(userId, req.body);
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(updatedUser);
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating user details", error });
  }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.query.userId;
        const deleted = await dynamoDbService.deleteUserDetails(userId);
        res.status(200).json({ message: "User deleted successfully" , deleted});
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};


  const createUser = async (req,res) => {
    try{
        const newUser = await dynamoDbService.createUserDetails(req.body)
        res.status(200).json(newUser)
    }catch (err) {
        console.log('Error',err)
        res.status(500).json({ message: "Error", err })
    }
}

  
module.exports = {
  getUserDetails,
  updateUserDetails,
  deleteUser,
  createUser
};
