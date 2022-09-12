const commentModel = require('../models/comments.model.js');
const postModel = require('../models/posts.model')
module.exports = {
    removeUserComments: async(params)=>{
        const userId = params.id;
        const result = await commentModel.find({commenter:userId});
        console.log(result);
        let removedPost;
        for(let i=0; i<result.length; i++){
            removedPost = await commentModel.findByIdAndDelete(result[i]._id).exec();
            console.log(removedPost);
        }
      
      },
      removeUserPosts: async(params)=>{
        const userId = params.id;
        const result = await postModel.find({author:userId});
        console.log(result);
        let removedPost;
        for(let i=0; i<result.length; i++){
            removedPost = await postModel.findByIdAndDelete(result[i]._id).exec();
            console.log(removedPost);
        }
      
    }


}