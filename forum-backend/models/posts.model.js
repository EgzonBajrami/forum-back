const mongoose = require('mongoose');
const schemaCleaner = require('../lib/schemaCleaner')


const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        maxlength:100,
        trim:true,
    
    },

    textSubmission:{
        type:String,
        maxLength:1000,
        required:true,
        minLength:10,
        trim:true,

    },
    imageSubmission:{
     type:String,
     
    },
    subforum:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'subforum',
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    upvotedBy:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        },
        
    ],
    downvotedBy:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'users',
        }
        
    ],
    points:{
        type:Number,
        default:1
    },
    
 
    createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },

})




const postModel = mongoose.model('Post', postSchema);
module.exports = postModel;