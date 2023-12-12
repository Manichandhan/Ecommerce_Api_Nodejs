const { Sequelize } = require('sequelize');
require('dotenv').config()
// Replace these credentials with your database configuration
const sequelize = new Sequelize('ecommerce', 'root', process.env.password, {
  host: 'localhost',
  dialect: 'mysql', 
  logging: (msg) => {
    if (msg.includes('error')) { 
      console.log(msg);
    }
  },
  define:{
    freezeTableName:true
  }
});

// Test the connection 
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .then(()=>{
    sequelize.sync({alter:true})
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err); 
  });

module.exports = sequelize;
