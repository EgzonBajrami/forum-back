const mongoose = require('mongoose');
const constants = require('../lib/constants')
const uniqueValidator = require('mongoose-unique-validator');
const schemaCleaner = require('../lib/schemaCleaner')
const userSchema = new mongoose.Schema(
    {
        firstName:{type:String, required:true},
        lastName:{type:String, required:true},
        username:{type:String, required:true},
    
     
    
        email: { 
            type: String, 
            required: true, 
            lowercase: true, 
            unique: true, 
            trim: true, 
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] },
            password:{type:String, required:true},
            age:{type:Number, min:15},
            role:{type:String,enum:Object.values(constants.role), required:true, default:constants.role.USER},
            verified:{type:Boolean, default:false},
            avatar: {
               
                
                 type: String,
                  trim: true,
                  default: 'https://imgur.com/WP6Xmtl.png',
              
              },
              karmaPoints: {
                postKarma: {
                  type: Number,
                  default: 0,
                },
                commentKarma: {
                  type: Number,
                  default: 0,
                },
              },
            posts:[{type:mongoose.Schema.Types.ObjectId, ref:'Post'}],
            subscribedSubs:[
                {
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'subforum'
                }
            ],
           
        
    },
    {
        timestamps:true,
    }
    
)
userSchema.plugin(uniqueValidator);
schemaCleaner(userSchema);
const usersModel = mongoose.model('users',userSchema);
module.exports = usersModel