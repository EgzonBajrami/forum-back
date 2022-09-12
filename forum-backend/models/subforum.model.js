const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schemaCleaner = require('../lib/schemaCleaner')

const subforumSchema = new mongoose.Schema({
    subforumName:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    icon:{
        type:String,
        required:true,
    },
    posts:[{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
    }
    ],
    subscribers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }],
    subscriberCount:{
        type:Number,
        default:1
    }
},
{
    timestamps:true
}

);
subforumSchema.plugin(uniqueValidator);
schemaCleaner(subforumSchema);

const subforumModel = mongoose.model('subforum', subforumSchema);

module.exports = subforumModel;