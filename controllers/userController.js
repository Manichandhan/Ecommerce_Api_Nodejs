const User=require('../Models/User')


const userController = {
    getAllUsers: (req, res) => {
      // Logic to fetch all users
      res.send('Get all users');
    },
    getUserById: (req, res) => {
      const userId = req.params.id;
      // Logic to fetch user by ID
      res.send(`Get user with ID ${userId}`);
    },
    createUser: (req, res) => {
      // Logic to create a new user
      
      const { body } = req;

      res.send(`Create user: ${JSON.stringify(body)}`);
    },
    updateUser: (req, res) => {
      const userId = req.params.id;
      // Logic to update user by ID
      const { body } = req;
      res.send(`Update user with ID ${userId}: ${JSON.stringify(body)}`);
    },
    deleteUser: (req, res) => {
      const userId = req.params.id;
      // Logic to delete user by ID
      res.send(`Delete user with ID ${userId}`);
    }
  };
  
  module.exports = userController;
