import mongoose from 'mongoose';

let Schema=mongoose.Schema;

let ChatGroupSchema= new Schema({
    name: String,
    userAmount: {type: Number, min:3, max: 200},
    messageAmount:{type: Number, default:0},
    userId: String,
    members:[
        {userId: String}
    ], 
    createdAt:{type:Number, default: Date.now},
    updatedAt:{type:Number, default: Date.now},
    deletedAt:{type:Number, default: Date.now}
});

ChatGroupSchema.statics={
    /**
     * Get chat group by userId
     * @param {*} userId 
     * @param {*} limit 
     */
    getChatGroups(userId,limit){
        return this.find({
            "members":{$elemMatch:{"userId":userId}}
        }).sort({"updatedAt ":-1}).limit(limit).exec();
    },

    getChatGroupById(id){
        return this.findById(id).exec();
    },

    /**
     * Update group chat when add new message
     * @param {*} id 
     * @param {*} newMessageAmount 
     */
    updateWhenHasNewMessage(id,newMessageAmount){
        return this.findByIdAndUpdate(id,{
            "messageAmount":newMessageAmount,
            "updatedAt":Date.now()
        }).exec()
    }
}

module.exports=mongoose.model("chat-group", ChatGroupSchema);