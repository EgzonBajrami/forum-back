const mongoose = require('mongoose');

const nestSchema = new mongoose.Schema({
    post: {
        type: mongoose.Types.ObjectId,
        ref: "Post",
        required: true,
      },
      content:{
        type:String,
      },
      parentComment:[{
        type: mongoose.Types.ObjectId,
        ref:"comment",
        
      }],
      childComment:[
        {
        type:mongoose.Types.ObjectId,
        ref:"comment",
      }],
      secondChild:[{
        type:mongoose.Types.ObjectId,
        ref:"comment",
      }],
      thirdChild:[{
        type:mongoose.Types.ObjectId,
        ref:"comment",
      }]

})

const nestModel =  mongoose.model("nest", nestSchema);
module.exports = nestModel;
