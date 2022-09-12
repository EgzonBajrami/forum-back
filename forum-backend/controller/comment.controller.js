const commentModel = require('../models/comments.model.js');
const postModel = require('../models/posts.model')
const nestModel = require('../models/nest.model')
const userModel = require('../models/users.models')


module.exports = { 
 

    
 

 
 
createPostComments: async(decoded,params,pst) =>{

  


  const postId= pst;
  console.log(postId);

  const {content, parent} = params;
  console.log(params);
  console.log(content);
  
  const commenter = decoded;
  const post = await postModel.findById(postId.id);
  if(!post){
    return "No posts exist by that ID"
  }
  const user = await userModel.findById(commenter);
  if(!user){
    return "No user exists by that Id"
  }
  

  
 
  const comment = await commentModel.create({
    content,
    parent: parent,
    post: postId.id,
    commenter: commenter,
  });



  await commentModel.populate(comment, { path: "commenter", select: "-password" });

   return comment;




},


getAllComments: async (req,res)=>{
  try {
    const postId = req.params.id;

    const comments = await commentModel.find({ post: postId })
      .populate("commenter", "-password")
      .sort("-createdAt");

    let commentParents = {};
    let rootComments = [];

    for (let i = 0; i < comments.length; i++) {
      let comment = comments[i];
      commentParents[comment._id] = comment;
    }

    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      if (comment.parent) {
        let commentParent = commentParents[comment.parent];
        commentParent.children = [...commentParent.children, comment];
      } else {
        rootComments = [...rootComments, comment];
      }
    }

    return res.json(rootComments);
  }catch(err){
    res.status(400).json(err.message);

  }
},
getSingleComment: async(req,res) =>{
  try{
    const commentId = req.params.id;
    console.log(commentId);
    const result = await commentModel.find({_id:commentId});
    if(!result){
      res.json({message:"no comment by that id"})
    }
    await commentModel.populate(result, {path:"commenter", select:"-password"})
    res.json({result})

  }
  catch(err){
    res.json(err.message)
  }
},
editComment: async(decoded,params,editId)=>{
    const commentId = editId.id;
    console.log(decoded);
    const {content, parentId} = params;
    console.log(commentId);
    const preEditComment = await commentModel.findById(commentId);
    if(!preEditComment){
      return "No comment exists by that ID";
    }
    const user = await userModel.findById(decoded);
   
    if(!user){
      return "No user exists by that Id!"
    }
    const editedComment = await commentModel.findByIdAndUpdate(commentId,{content:content});
    console.log(editedComment);
 
    return editedComment;

},
removeComment: async(commentId) =>{
  console.log(commentId);
  const result = await commentModel.findByIdAndUpdate(commentId.id,{content:"deleted"});
  if(!result){
    return "No comment exists by that ID";
  }
  return result;
},
getUserComments: async(userId) =>{
  const result = await commentModel.find({commenter:userId.id});
  await commentModel.populate(result,{path:"post"})
  return result;
},

}