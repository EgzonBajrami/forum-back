const postModel = require('../models/posts.model')

module.exports ={
    create: async(values)=> {
        const result = await postModel.create(values).exec();
        return result;

    }
}