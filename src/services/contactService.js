import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import _ from "lodash";

let findUserContact=(currentUserId,keyword)=>{
    return new Promise(async(resolve,reject)=>{
        let deprecatedUserIds=[];
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

module.exports={
    findUserContact:findUserContact
}