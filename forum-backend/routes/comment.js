const express = require("express");
const router = express.Router();
const commentController = require('../controller/comment.controller')
const { verifyToken } = require("../middleware/auth.middleware");
const {jsonResponse} = require('../lib/helper.js')

router.post('/:id',verifyToken, async(req,res)=>{
    try{
        console.log(req.body);
        const result = await commentController.createPostComments(req.decoded,req.body,req.params);
        res.json(jsonResponse(result));
        
    }
    catch(err){
        res.json(jsonResponse(err.message,false))

    }
});
router.get("/post/:id", commentController.getAllComments);
router.get("/:id", commentController.getSingleComment);

router.post('/edit/:id', verifyToken, async(req,res)=>{
    try{
        console.log(req.decoded)
        const result = await commentController.editComment(req.decoded, req.body, req.params);
        res.json(jsonResponse(result));

    }
    catch(err){
        res.json(jsonResponse(err.message,false));
    }
})
router.post('/remove/:id', verifyToken, async(req,res)=>{
    try{
        const result = await commentController.removeComment(req.params);
        res.json(jsonResponse(result));

    }catch(err){
        res.json(jsonResponse(err.message,false))
    }
})
router.get('/profile/:id', verifyToken, async(req,res) =>{
    try{
        const result = await commentController.getUserComments(req.params);
        res.json(jsonResponse(result));
    }catch(err){
        res.json(jsonResponse(err.message,false))
    }
})

module.exports = router;