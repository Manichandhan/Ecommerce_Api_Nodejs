// Import required modules
const express = require('express');
require('dotenv').config()
// Create an instance of Express
const app = express();
// database connection
const sequelize=require('./config/dbConnection')
// Middleware for parsing JSON data
app.use(express.json());

// Routes
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

// Set up the server to listen on a port
const PORT = process.env.PORT || 3000; // Use the default port 3000 or a port provided in the environment
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
