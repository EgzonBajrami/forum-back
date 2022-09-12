const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host:'smtp.mailtrap.io',
    port:parseInt(2525),
    auth:{
        user:'af72a15855930f',
        pass:'cd5cdda29204cf',

    },
})
const forgotPasswordTemplate = (token) => {
    const  url = `http:localhost:3000/reset-password?token=${token}`;
    return {
      subject: 'ForumApp  (Forgot Password)',
      text: `Seems like you forgot your password for forum app. if this is true, click on the link below to reset your password \n ${url}`,
      html: `
        <h1>Password Reset</h1>
        <p>Seems like you forgot your password for super hero app. if this is true, click on the link below to reset your password</p>
        <a href="${url}">Reset Password</a>`
    }
  }
const verifyUserTemplate = (token) =>{
    const url = `http:localhost:3000/verify?token=${token}`;
     return {
        subject:'Forum App (verify account)',
        text:`To verify your account, please click below \n ${url}`,
        html:`
        <h1>Verify Account </h1>
        <p>To verify your account click on the link below </p>
        <a href="${url}">Verify</a>`
     }
}
module.exports = {
    sendForgotPasswordEmail: async (email, token) => {
        console.log('send password func')
        const body = forgotPasswordTemplate(token)
    
        const info = await transporter.sendMail({
          from: 'Forum App <forum@forum.com',
          to:  email,
          subject: body.subject,
          text: body.text,
          html: body.html,
        })
        return info.response
      },
    sendRegistrationEmail:async (email, token) =>{
        const body = verifyUserTemplate(token);
        transporter.sendMail({
            from:'Forum App <forum@forum.com',
            to: email,
            subject: body.subject,
            text: body.text,
            html: body.html
        })
    }
}