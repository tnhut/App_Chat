import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import _ from "lodash";

let findUserContact=(currentUserId,keyword)=>{
    return new Promise(async(resolve,reject)=>{
        let deprecatedUserIds=[currentUserId];
        let contactsByUser=await ContactModel.findAllByUser(currentUserId);
        contactsByUser.forEach(item=>{
            deprecatedUserIds.push(item.userId);
            deprecatedUserIds.push(item.contactId);
        });
       
        deprecatedUserIds=_.uniqBy(deprecatedUserIds);
      
        let users= await UserModel.findAllForAddContact(deprecatedUserIds,keyword);
        
        resolve(users);
    })
};

let addNew=(currentUserId,contactId)=>{
    return new Promise(async(resolve,reject)=>{
        let contactExists=await ContactModel.checkExists(currentUserId,contactId);
        if(contactExists){
            return reject(false);
        }

        let newContactItem={
            userId:currentUserId,
            contactId:contactId
        };
        let newContact=await ContactModel.createNew(newContactItem);
        resolve(newContact);
    })
};

let removeRequestContact=(currentUserId,contactId)=>{
    return new Promise(async(resolve,reject)=>{
        let removeRequest=await ContactModel.removeRequestContact(currentUserId,contactId);
        if(removeRequest.result.n===0){
            return reject(false);
        }
        resolve(true);
    })
};

module.exports={
    findUserContact:findUserContact,
    addNew:addNew,
    removeRequestContact:removeRequestContact
}