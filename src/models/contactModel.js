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
     * Remove Contact
     * @param {*} userId 
     * @param {*} contactId 
     */
    removeContact(userId,contactId){
        return this.remove({
            $or:[
                {$and:[
                    {"userId":userId},
                    {"contactId":contactId},
                    {"status":true}
                ]},
                {$and:[
                    {"userId":contactId},
                    {"contactId":userId},
                    {"status":true}
                ]}
            ]  
        }).exec();
    },

    /**
     * Remove request Contact Sent
     * @param {*} userId 
     * @param {*} contactId 
     */
    removeRequestContactSent(userId,contactId){
        return this.remove({
            $and:[
                {"userId":userId},
                {"contactId":contactId},             
                {"status":false}
            ]
        }).exec();
    },

      /**
     * Remove Request Contact Received
     * @param {*} userId 
     * @param {*} contactId 
     */
    removeRequestContactReceived(userId,contactId){
        return this.remove({
            $and:[
                {"contactId":userId},
                {"userId":contactId},
                {"status":false}
               
            ]
        }).exec();
    },

    /**
     * approve Request Contact Received
     * @param {*} userId 
     * @param {*} contactId 
     */
    approveRequestContactReceived(userId,contactId){
            return this.update({
                $and:[
                    {"contactId":userId},
                    {"userId":contactId},
                    {"status":false}
                   
                ]
            },  
            {
                    "status":true,
                    "updatedAt":Date.now()
            }
            ).exec();
    },
    

    /**
     * Get Contacts by UserId
     * @param {String} userId 
     * @param {Number} limit 
     * @returns 
     */
    getContacts(userId,limit){
        // Lay ra 1 trong 2 TH
        // 1 mình gửi ket bn cho ngươi khac va được accept)
        // 2 người khác gửi ket bn cho mình va được accept)
        return this.find({
            $and:[
                {$or:[
                    {"userId":userId},
                    {"contactId":userId}
                ]},
                {"status":true},
            ]
        }).sort({
            "updatedAt":-1
        }).limit(limit).exec();
    },

    /**
     * Get ContactSent by UserId
     * @param {String} userId 
     * @param {Number} limit 
     * @returns 
     */
    getContactSent(userId,limit){
        return this.find({
            $and:[
                {"userId":userId},
                {"status":false},
            ]
        }).sort({
            "createdAt":-1
        }).limit(limit).exec();
    },

     /**
     * Get ContactReceived by UserId
     * @param {String} userId 
     * @param {Number} limit 
     * @returns 
     */
    getContactReceived(userId,limit){
        return this.find({
            $and:[
                {"contactId":userId},
                {"status":false},
            ]
        }).sort({
            "createdAt":-1
        }).limit(limit).exec();
    },

     /**
     * CountAll Contacts by UserId
     * @param {String} userId 
     * @returns 
     */
    countAllcontacts(userId){
        // Lay ra 1 trong 2 TH
        // 1 mình gửi ket bn cho ngươi khac va được accept)
        // 2 người khác gửi ket bn cho mình va được accept)
        return this.count({
            $and:[
                {$or:[
                    {"userId":userId},
                    {"contactId":userId}
                ]},
                {"status":true},
            ]
        }).exec();
    },

    /**
     * CountAll ContactSent by UserId
     * @param {String} userId 
     * @returns 
     */
    countAllcontactsSent(userId){
        return this.count({
            $and:[
                {"userId":userId},
                {"status":false},
            ]
        }).exec();
    },

     /**
     * CountAll ContactReceived by UserId
     * @param {String} userId 
     * @returns 
     */
    countAllcontactsReceived(userId){
        return this.count({
            $and:[
                {"contactId":userId},
                {"status":false},
            ]
        }).exec();
    },
    /**
     * Get more contact
     * @param {*} userId 
     * @param {*} skip 
     * @param {*} limit 
     */
    readMoreContacts(userId,skip,limit){
        return this.find({
            $and:[
                {$or:[
                    {"userId":userId},
                    {"contactId":userId}
                ]},
                {"status":true},
            ]
        }).sort({
            "updatedAt":-1
        }).skip(skip).limit(limit).exec();
    },
    /**
     * Get more contact Sent by userid
     * @param {*} userId 
     * @param {*} skip 
     * @param {*} limit 
     * @returns 
     */
    readMoreContactsSent(userId,skip,limit){
        return this.find({
            $and:[
                {"userId":userId},
                {"status":false},
            ]
        }).sort({
            "createdAt":-1
        }).skip(skip).limit(limit).exec();
    },
    /**
     * Get more contact Received
     * @param {*} userId 
     * @param {*} skip 
     * @param {*} limit 
     * @returns 
     */
    readMoreContactsReceived(userId,skip,limit){
        return this.find({
            $and:[
                {"contactId":userId},
                {"status":false},
            ]
        }).sort({
            "createdAt":-1
        }).skip(skip).limit(limit).exec();
    },
    /**
     * Update contact when add new message
     * @param {String} userId 
     * @param {String} contactId 
     */
    updateWhenHasNewMessage(userId,contactId){
        return this.update({
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
        }, {
            "updatedAt":Date.now()
        }).exec();
    },

    /**
     * Get Contacts Friend by UserId
     * @param {String} userId 
     * @returns 
     */
     getFriends(userId){
        // Lay ra 1 trong 2 TH
        // 1 mình gửi ket bn cho ngươi khac va được accept)
        // 2 người khác gửi ket bn cho mình va được accept)
        return this.find({
            $and:[
                {$or:[
                    {"userId":userId},
                    {"contactId":userId}
                ]},
                {"status":true},
            ]
        }).sort({
            "updatedAt":-1
        }).exec();
    }
}

module.exports=mongoose.model("contact", ContactSchema);