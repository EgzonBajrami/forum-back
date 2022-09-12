const postService = require('../services/post.service');
const userModel = require('../models/users.models');
const postModel = require('../models/posts.model');
const subModel = require('../models/subforum.model')

module.exports = {
    insert: async(params) =>{
        
    },
    createNewPost: async(userId,postBody,params) =>{
        const {
           
            title,
            content,
            img,
            
        } = postBody;
        
        const user = userId;
        const subforum = params.id;
      
    

        const author = await userModel.findById(user);
        const targetSub = await subModel.findById(subforum);
 
       
        if(!author){
           return "User does not exist";
        }
        if(!targetSub){
            return "Subforum could not be found."
        }
        const newPost = new postModel({
            title:postBody[0],
            subforum: targetSub._id,
            textSubmission:postBody[1],
            imageSubmission:postBody[2],
            author: author._id,
            
            upvotedBy:[author._id],
            pointsCount:1,

        })
        console.log(newPost);
   
        const savedPost = await newPost.save();
        targetSub.posts = targetSub.posts.concat(savedPost._id);
        author.posts = author.posts.concat(savedPost._id);
        await author.save();
        await targetSub.save();
        const populatedPost = await savedPost
        .populate('author', 'username')
       

      
        
      return populatedPost;


    },
    editPost: async(content,params) =>{
        console.log(content[0]);
      
        const postId = params.id;
        console.log(postId);
        const post = await postModel.findByIdAndUpdate(postId,{"title":content[0],"textSubmission":content[1],"imageSubmission":content[2]});
        console.log(post);
        return post;
    },
    removePost: async(params) =>{
        const postId = params.id;
        const post = await postModel.findByIdAndDelete(postId);
        return post;
    },
    getSubforum:async(params) =>{
        const forumId = params.id;
        const post = await postModel.find({subforum:forumId});
        await postModel.populate(post,({path:"author",select:"-password"}))
        console.log(post);
        return post;
    },
    updateUpvote:async(decoded,params)=>{
        const user = decoded;
        console.log(user);
        const postId= params.id;
        console.log(postId)
        const result = await postModel.find({"_id":postId})
        console.log(result);
         const upvoted = result[0].upvotedBy;
         const downvoted = result[0].downvotedBy;
         if(downvoted.includes(user)){
            const removeDown = downvoted.indexOf(user);
            await downvoted.splice(removeDown,1);
            const removedDownvote = await postModel.findByIdAndUpdate(postId,{"downvotedBy":upvoted}).exec();
            console.log(removedDownvote)
            
         }
      
         console.log(upvoted.includes(user))
        const toBeRemoved = upvoted.indexOf(user);
        if(upvoted.includes(user)){ 
            await upvoted.splice(toBeRemoved,1);
            const removedUpvote = await postModel.findByIdAndUpdate(postId,{"upvotedBy":upvoted}).exec();
              console.log(removedUpvote + " j")
            return removedUpvote;
        }

        console.log(upvoted);
    
        if(!upvoted.includes(user)){
             await upvoted.push(user);
            
            const points = result.points;
            console.log(points);
             const addUpvote = await postModel.findByIdAndUpdate(postId,{"upvotedBy":upvoted}).exec();
            console.log(addUpvote);
            return addUpvote;
        }
       

    },
    updateDownvote:async(decoded,params)=>{
        const user = decoded;
        console.log(user);
        const postId= params.id;
        console.log(postId)
        const result = await postModel.find({"_id":postId})
        console.log(result);
         const upvoted = result[0].upvotedBy;
         const downvoted = result[0].downvotedBy;
         if(upvoted.includes(user)){
            const removeUp = upvoted.indexOf(user);
            await upvoted.splice(removeUp,1);
            const removeUpVote = await postModel.findByIdAndUpdate(postId,{"upvotedBy":upvoted}).exec();
            console.log(removeUpVote)
            
         }
      
         console.log(upvoted.includes(user))
        const toBeRemoved = downvoted.indexOf(user);
        if(downvoted.includes(user)){ 
            await downvoted.splice(toBeRemoved,1);
            const removedDownvote = await postModel.findByIdAndUpdate(postId,{"downvotedBy":downvoted}).exec();
              console.log(removedDownvote + " j")
            return removedDownvote;
        }

        console.log(upvoted);
    
        if(!downvoted.includes(user)){
             await downvoted.push(user);
            
           
             const addDown = await postModel.findByIdAndUpdate(postId,{"downvotedBy":downvoted}).exec();
            console.log(addDown);
            return addDown;
        }

    },
    findByUser:async(params) =>{
        const userId = params.id;
        const result = await postModel.find({"author":userId});
        return result;
    }
   
}