const userService = require('../services/user.services.js');
const bcrypt = require('bcrypt');
const emailService = require('../services/email.service')
const jwt = require('jsonwebtoken')
const userModel = require('../models/users.models')
const deleteService = require('../services/delete.service')
module.exports ={
    add: async(params) =>{
        console.log(params);
        const { password, firstName, lastName,username, age, email } = params

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS))
        

        params.password = hashedPassword
        const result = await userService.insert(params);
        console.log(result);
        const token = jwt.sign({ _id: result._id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12 }, process.env.JWT_VERIFY_SECRET)
        emailService.sendRegistrationEmail(email, token)
        return result._id;
    },
    verifyAccount: async (id) =>{
        const result = await userService.verifyAccount(id);
        return result._id;
    },
    findUser: async(params)=>{
        const userId = params.id;
        const result = await userService.findId(userId);
        return result;
    },
    editUser: async(fields,params) =>{
        const userId = params.id;
        console.log(fields);

        const result = await userModel.findByIdAndUpdate(userId,{"firstName":fields[0],"lastName":fields[1],"age":fields[2],"username":fields[3],"avatar":fields[4]}).exec()
        return result;

    },
    findByUserName:async(params) =>{
        console.log(params.username);
        const result = await userModel.find({"username":params.username})
        return result;
    },
    removeUser: async(params)=>{
        const deleteComments = await deleteService.removeUserComments(params.id);
        const deletePosts = await deleteService.removeUserPosts(params.id);
        const result = await userModel.findByIdAndDelete(params.id);
        return result;
    },
    changePassword: async (password, id) => {
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT))
        const result = await userService.updatePassword(id, hashedPassword)
        return result._id
      },
}