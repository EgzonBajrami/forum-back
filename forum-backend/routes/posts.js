const express = require('express');
const { jsonResponse } = require('../lib/helper')
const postModel = require('../models/posts.model.js');
const postController = require('../controller/post.controller');
const { verifyToken } = require("../middleware/auth.middleware");
const paginateResults = require('../lib/paginateResults')

const router = express.Router();

router.get('/', async function(req, res, next) {

});
router.post('/:id', verifyToken, async(req,res) =>{
  try{
    const result = await postController.createNewPost(req.decoded,req.body,req.params)
    res.json(jsonResponse(result))

  }
  catch(err){
    res.json(jsonResponse(err.message,false))
  }
} )
router.get('/:id', async (req,res)=>{
    console.log(req.params.id);
  try{ 
   
   const result = await postModel.findById(req.params.id);
   result.points = result.upvotedBy.length -result.downvotedBy.length;
   await postModel.populate(result,{path:"author", select:('-password')});
   res.json(jsonResponse(result));
  }
  catch(err){
    res.json({err:"No posts by that id"})
  }
    
})
router.get('/subforum/:id', async(req,res)=>{
  try{
    const result = await postController.getSubforum(req.params);
    console.log(result);

  }
  catch(err){
    res.json(jsonResponse(err.message,false));
  }
})
router.post('/edit/:id', verifyToken, async(req,res) =>{
try{
  const result = await postController.editPost(req.body,req.params);
  return result;

}
catch(err){
  res.json(jsonResponse(err.message,false))
}
}
)
router.post('/remove/:id', verifyToken, async(req,res) =>{
  try{
    const result = await postController.removePost(req.params);
    res.json(jsonResponse(result));
  }
  catch(err){
    res.json(jsonResponse(err.message,false));
  }
})
router.post('/upvote/:id', verifyToken, async(req,res)=>{
  try{
    const result = await postController.updateUpvote(req.decoded,req.params);
    res.json(jsonResponse(result));

  }catch(err){
    res.json(jsonResponse(err.message,false))
  }
})
router.post('/downvote/:id', verifyToken, async(req,res)=>{
  try{
    const result = await postController.updateDownvote(req.decoded, req.params);
    res.json(jsonResponse(result));
  }catch(err){
    res.json(jsonResponse(err.message,false))
  }
})
router.get('/userPosts/:id',verifyToken, async(req,res)=>{
  try{
    const result = await postController.findByUser(req.params);
    res.json(jsonResponse(result));

  }catch(err){
    res.json(jsonResponse(err.message,false))
  }
})
module.exports = router;