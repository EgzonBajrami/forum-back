const userService = require('../services/user.services');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailService = require('../services/email.service')

module.exports ={
    login: async(params)=>{
        const { email,password} = params

        const user = await userService.findByEmail(email);
        if(!user){
            throw Error('User does not exist')
        }
        if(!(await bcrypt.compare(password,user.password))){
            throw Error('Password is incorrect');
        }
        let refresher =[];
        const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET)
        const refreshToken = jwt.sign({_id:user._id}, process.env.REFRESH_JWT_SECRET)
        refresher.push(refreshToken);
        
        return {
            token,
            role: user.role
        }
        
    },
    forgotPassword: async (params) => {
        const { email } = params
        const user = await userService.findByEmail(email)
        if (!user) {
          throw Error('Email does not exist')
        }
        console.log('email found!')
    
        const token = jwt.sign({ _id: user._id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12 }, process.env.JWT_FORGOT_PASSWORD_SECRET)
        console.log('token', token)
    
    
        return await emailService.sendForgotPasswordEmail(email, token)
      },
}