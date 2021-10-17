import mongoose from 'mongoose';

let Schema=mongoose.Schema;

let ContactSchema= new Schema({
    userId:String,
    contactId:String,
    status:{type: Boolean, default:false},
    createdAt:{type:Number, default: Date.now},
    updatedAt:{type:Number, default: null},
    deletedAt:{type:Number, default: null}
});

ContactSchema.statics={
    createNew(item){
        return this.create(item);
    },
    /**
     * 
     * @param {string} userId 
     */

    findAllByUser(userId){
        return this.find({
            $or:[
                {"userId":userId},
                {"contactId":userId}
            ]
        }).exec();
    },

    /**
     * Check Exists of user
     * Kiểm tra cho 2 TH: 1) Giả sửa A gửi loi mời KB cho B. 2) B có gửi lời mời cho A hay chưa
     * @param {string} userId 
     * @param {string} contactId 
     */
    checkExists(userId,contactId){
        return this.findOne({
            $or:[
                {$and:[
                    {"userId":userId},
                    {"contactId":contactId}
                ]},
                {$and:[
                    {"userId":contactId},
                    {"contactId":userId}
                ]}
            ]
        }).exec();
    },

    /**
     * Remove request
     * @param {*} userId 
     * @param {*} contactId 
     */
    removeRequestContact(userId,contactId){
        return this.remove({
            $and:[
                {"userId":userId},
                {"contactId":contactId}
            ]
        }).exec();
    }
}

module.exports=mongoose.model("contact", ContactSchema);