const express = require('express');
const authController = require('../controller/auth.controller');
const router = express.Router();
const userController = require('../controller/user.controller');
const fieldMiddleware = require('../middleware/field.middleware.js');
const userService = require('../services/user.services.js');
const { jsonResponse } = require('../lib/helper')
const jwt = require('jsonwebtoken');


/* GET home page. */
router.get('/', async function(req, res, next) {

});
router.post('/username', async (req,res)=> {
 try{
  const result = await authController.find(req.body);
 
  res.json(jsonResponse(result));

 }catch(err) {
  res.status(400).json(jsonResponse(err.message));

 }
})
router.post('/login', fieldMiddleware.login, fieldMiddleware.validate,async (req,res)=>{
  try{
    const result = await authController.login(req.body);
    res.json(jsonResponse(result));
  
  }catch(err){
    res.status(400).json(jsonResponse(err.message,false));

  }
})
router.post('/refresh-token', async (req, res) => {
  try {
    const result = await authController.refreshToken(req.body);
    res.json(jsonResponse(result));
  } catch (err) {
    res.status(400).json(jsonResponse(err.message, false));
  }
})
router.post('/logout', async (req, res) => {
  try {
    const result = await authController.logout(req.body);
    res.json(jsonResponse(result));
  } catch (err) {
    res.status(400).json(jsonResponse(err.message, false));
  }
})

router.post('/register',fieldMiddleware.register, fieldMiddleware.validate, async(req,res)=>{
 
  try{
    const result = await userController.add(req.body);
    res.json(jsonResponse(result));

  }
  catch(err){
    res.json(jsonResponse(err.message,false));

  }
})
router.post('/forgot-password-request', fieldMiddleware.email, fieldMiddleware.validate, async (req, res) => {
  try {
    const result = await authController.forgotPassword(req.body)
    res.json(jsonResponse(result))
  } catch (err) {
    res.status(400).json(jsonResponse(err.message, false))
  }
})

module.exports = router;
