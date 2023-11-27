const { Sequelize } = require('sequelize');
require('dotenv').config()
// Replace these credentials with your database configuration
const sequelize = new Sequelize('ecommerce', 'root', process.env.password, {
  host: 'localhost',
  dialect: 'mysql' // You can use other dialects like postgres, sqlite, etc.
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
