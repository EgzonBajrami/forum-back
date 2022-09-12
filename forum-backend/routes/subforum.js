const express = require('express');
const subController = require('../controller/subforum.controller');

const { jsonResponse } = require('../lib/helper')
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.post('/', subController.createNewSub);
router.get('/', verifyToken, subController.findAll);
router.get('/subId/:id', verifyToken,async (req,res)=>{
   
    
    try{ 
      const result = await subController.findSub(req.params);
      console.log(req.params.id);
      res.json(jsonResponse(result));
    }
    catch(err){
      res.json(jsonResponse(err.message,false))
      
    }
  })
  router.get('/subName/:id', verifyToken, async(req,res)=>{
    try{
      const result = await subController.findByName(req.params);
      res.json(jsonResponse(result));
    }catch(err){
      res.json(jsonResponse(err.message,false));
    }
  })
  router.post('/createnewsub', verifyToken, async(req,res)=>{
    try{
      const result = await subController.createNewSub(req.decoded,req.body);
      res.json(jsonResponse(result))

    }
    catch(err){
      res.json(jsonResponse(err.message,false))
    }
  } )
  router.post('/editSub/:id', verifyToken, async(req,res)=>{
    try{
      const result = await subController.updateSub(req.body,req.params);
      res.json(jsonResponse(result));

    }
    catch(err){
      res.json(jsonResponse(err.message,false))
    }
  })
module.exports = router;