const usersModel = require('../models/users.models.js');

module.exports ={
    insert: async(values)=>{
        const result = await usersModel.create(values)
        console.log(result);
        return result;
    },
    findByEmail: async(email)=>{
        const result = await usersModel.findOne({email}).exec()
        return result
    },
    verifyAccount: async(_id) =>{
        const result  = await usersModel.findByIdAndUpdate(_id,{verified:true}).exec()
        return result;
    },
    findAll: async() =>{
        const result = await usersModel.find().exec()
        return result;
    },
    findId: async(userId) =>{
        const result = await usersModel.findById(userId);
        console.log(result);
        return result;
    },
    editUser: async(content,userId) =>{
        const result = await usersModel.findByIdAndUpdate(userId, content);
        console.log(result);
        return result;
    },
    updatePassword: async (_id, password) => {
        const result = await usersModel.findByIdAndUpdate(_id, { password }).exec()
        return result
      },
}