const subforumModel = require('../models/subforum.model')
const userModel = require('../models/users.models')
const jsonResponse = require('../lib/helper');
const postModel = require('../models/posts.model');
module.exports = {
    createNewSub: async(req,res) =>{
        const {subforum, description, user} = req.body;

        const admin = await userModel.findById(user);
        console.log(admin);
        if(!admin){
            return res.status(404).json({message:"User needs to be an admin"})
        }
        const newsubforum = new subforumModel({
            subforumName:subforum,
            description,
            admin:admin._id,
            subscribedBy:[admin._id],
            subscriberCount:1
        })
        const savedSub = await newsubforum.save();
        admin.subscribedSubs = admin.subscribedSubs.concat(savedSub._id);
        return res.status(200).json({data:savedSub})


    },
    findAll: async(req,res) =>{
        const subforums = await subforumModel.find();
        return res.json({message:subforums});
    },
    findSub: async(params) =>{
        const subId = params.id;
        const subforum = await subforumModel.findById(subId);
    await subforumModel.populate(subforum,({path:'posts'}))
   
      
       

      
        return subforum;
    },
    createNewSub: async(decoded,params) =>{
        const {subforum, description,icon} = params;
        const user = decoded;

        const admin = await userModel.findById(user);
        console.log(admin);
        if(!admin){
            return 'User needs to be an admin!'
        }
        const newsubforum = new subforumModel({
            subforumName:subforum,
            description,
            icon,
            admin:admin._id,
            subscribedBy:[admin._id],
            subscriberCount:1
        })
        const savedSub = await newsubforum.save();
        admin.subscribedSubs = admin.subscribedSubs.concat(savedSub._id);
        return savedSub;

    },
    findByName: async(params)=>{
        const subName = params.id;
        console.log(subName);
        const result = await subforumModel.find({subforumName:subName});
        console.log(result);
        return result;
    },
    updateSub:async(data,params)=>{
        const {subforumName,description,icon} = data;
        const forumId=params.id;
        const result = await subforumModel.findByIdAndUpdate(forumId,{subforumName:subforumName,description:description,icon:icon})
        return result;
    }
}