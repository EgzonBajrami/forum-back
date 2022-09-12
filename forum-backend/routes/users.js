var express = require('express');
var router = express.Router();
const userController = require('../controller/user.controller');
const {jsonResponse} = require('../lib/helper');
const { verifyForgotPasswordToken, verifyRegistrationToken } = require('../middleware/auth.middleware.js')
const { verifyToken } = require("../middleware/auth.middleware");
const { idCheck, password, validate } = require('../middleware/field.middleware')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/verify', verifyRegistrationToken, async(req,res)=>{
  try{
    const response = await userController.verifyAccount(req.decoded);
    res.json(jsonResponse(response));
  }
  catch(err){
    res.status(500).json(jsonResponse(err.message, false));
  }
})
router.get('/:id', verifyToken, async(req,res)=>{
  try{
    const result = await userController.findUser(req.params);
    res.json(jsonResponse(result));

  }
  catch(err){
    res.json(jsonResponse(err.message,false))
    
  }

})


router.get('/dashboard/:username', verifyToken, async(req,res)=>{
  try{
   
    const result = await userController.findByUserName(req.params);
    res.json(jsonResponse(result));

  }catch(err){
    res.json(jsonResponse(err.message,false))
  }
})

router.post('/edit/:id', verifyToken, async(req,res)=>{
  try{
    const result = await userController.editUser(req.body,req.params);
    res.json(jsonResponse(result))

  }
  catch(err){
    res.json(jsonResponse(err.message,false));
  }
})
router.post('/remove/:id', verifyToken, async(req,res)=>{
  try{
    const result = await userController.removeUser(req.params);
    res.json(jsonResponse(result));

  }
  catch(err){
    res.json(jsonResponse(err.message,false))
  }
})
router.post('/forgot-password', verifyForgotPasswordToken, async (req, res) => {
  try {
    const response = await userController.changePassword(req.body.password, req.decoded)
    res.json(jsonResponse(response))
  } catch (err) {
    res.status(500).json(jsonResponse(err.message, false))
  }
})


module.exports = router;
