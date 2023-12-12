const {User}= require("../Association/associate");
const {Op}=require('sequelize')
const {CustomError}=require('../utils/CustomError')
const {CartModel}=require('../Association/associate')
const userController = {
  getAllUsers: (req, res,next) => {
    // Logic to fetch all users
    User.findAll({include:CartModel}).then((data)=>{
      if(data.length==0){
        return res.status(400).send('No users')
      }
      res.status(200).json(data)
    }).catch((err)=>{
      next(new CustomError(400,err.message))
    })
  },
  getUserById: (req, res,next) => {
    const userId = req.params.id;
    // Logic to fetch user by ID
    User.findByPk(userId).then((data)=>{
      if(!data){
        return res.status(400).send(`no user found with id ${userId}`)
      }
      res.status(200).json(data)
    }).catch((err)=>{
          next(new CustomError(400,err.message))
    })
  },
  createUser: async (req, res) => {
    // Logic to create a new user

    const { body } = req;
    const newUser =  User.create({
      email:body.email,
      username:body.username,
      password:body.password,
      isAdmin:body.isAdmin,
      address:body.address
    });
    newUser.then((data)=>{
      CartModel.create({userid:data.id})
     res.status(201).json(data)
    }).catch((err)=>{
      if(err.name=='SequelizeValidationError'){
      const messages=err.errors.map((obj)=>{
             const msg={message:obj.message}
             return msg
      }) 
      res.status(400).json(messages)  
      }else if(err.name=="SequelizeUniqueConstraintError"){
        res.status(400).json({message:err.errors[0].message,value:err.errors[0].value})
      }else{
        res.status(400).json(err)
      }
     
    })
   
  },
  restoreUser:async(req,res,next)=>{
    User.restore({ where: { email: req.body.email } })
    .then((restoredUser) => {
      if(restoredUser){
        return res.status(200).json({restored:restoredUser})
      }
      next(new CustomError(400,`${req.body.email} user not found to restore`))
    })
    .catch((error) => {
      next(error)
    });
  }
  ,
  updateUser: async(req, res) => {
    const userId = req.params.id;
    // Logic to update user by ID
    const { body } = req;
    User.update({
      address:body.address
    },{
      where:{[Op.or]:[{id:userId},{email:body.email}]}
    }).then((data)=>{
      console.log(data);
      res.status(200).send(data)
    }).catch((err)=>{
      next(new CustomError(400,err.message))
    })

   
  },
  deleteUser: (req, res) => {
    const userId = req.params.id;
    // Logic to delete user by ID
    User.destroy({where:{id:req.params.id}}).then((data)=>{
      res.status(200).json({data:data,message:'deleted successfully'})
    }).catch((err)=>{
      res.status(400).send(err)
    })
    
  },
};

module.exports = userController;
