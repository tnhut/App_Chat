import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import NotificationModel from "./../models/notificationModel";
import _ from "lodash";
const LIMIT_NUMBER_TAKEN=10;

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

        // Create Notifycation
        let notificationItem={
            senderId: currentUserId,
            receiverId:contactId,
            type: NotificationModel.types.ADD_CONTACT
        };

        await NotificationModel.model.createNew(notificationItem);
        resolve(newContact);
    })
};

let removeRequestContactSent=(currentUserId,contactId)=>{
    return new Promise(async(resolve,reject)=>{
        let removeRequest=await ContactModel.removeRequestContactSent(currentUserId,contactId);
        if(removeRequest.result.n===0){
            return reject(false);
        }

        // remove notification
        let notifTypeAddContact=NotificationModel.types.ADD_CONTACT;
        await NotificationModel.model.removeRequestContactSentNotification(currentUserId,contactId,notifTypeAddContact);
        resolve(true);
    })
};

let getContacts=(currentUserId)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let contacts=await ContactModel.getContacts(currentUserId,LIMIT_NUMBER_TAKEN);
            let users=contacts.map(async(contact)=>{
               
                if(contact.contactId==currentUserId){
                   
                    return await UserModel.getNormalUserDataById(contact.userId);
                }
                else{
                    
                    return await UserModel.getNormalUserDataById(contact.contactId);
                }
                      
           });

           resolve(await Promise.all(users));

        } catch (error) {
           reject(error); 
        }
    })
};

let getContactSent=(currentUserId)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let contacts=await ContactModel.getContactSent(currentUserId,LIMIT_NUMBER_TAKEN);
            let users=contacts.map(async(contact)=>{
               return await UserModel.getNormalUserDataById(contact.contactId);
                
           });

           resolve(await Promise.all(users));
        } catch (error) {
           reject(error); 
        }
    })
};

let getContactReceived=(currentUserId)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let contacts=await ContactModel.getContactReceived(currentUserId,LIMIT_NUMBER_TAKEN);
            let users=contacts.map(async(contact)=>{
               return await UserModel.getNormalUserDataById(contact.userId);
                
           });

           resolve(await Promise.all(users));
        } catch (error) {
           reject(error); 
        }
    })
};

let countAllcontacts=(currentUserId)=>{
    return new Promise(async(resolve,reject)=>{
        try {
          
          let count=await ContactModel.countAllcontacts(currentUserId);
          resolve(count);
        } catch (error) {
           reject(error); 
        }
    })
};

let countAllcontactsSent=(currentUserId)=>{
    return new Promise(async(resolve,reject)=>{
        try {
          
          let count=await ContactModel.countAllcontactsSent(currentUserId);
          resolve(count);
        } catch (error) {
           reject(error); 
        }
    })
};

let countAllcontactsReceived=(currentUserId)=>{
    return new Promise(async(resolve,reject)=>{
        try {
          
          let count=await ContactModel.countAllcontactsReceived(currentUserId);
          resolve(count);
        } catch (error) {
           reject(error); 
        }
    })
};

let readMoreContacts=(currentUserId,skipNumberContact)=>{
    return new Promise(async(resolve,reject)=>{
        try {
           let newContacts= await ContactModel.readMoreContacts(currentUserId,skipNumberContact,LIMIT_NUMBER_TAKEN);

           let users=newContacts.map(async(contact)=>{
                if(contact.contactId==currentUserId){
                    
                    return await UserModel.getNormalUserDataById(contact.userId);
                }
                else{
                    
                    return await UserModel.getNormalUserDataById(contact.contactId);
                }
           });


            resolve(await Promise.all(users));
        } 
        catch (error) {
            reject(error);
        }
    })
}

let readMoreContactsSent=(currentUserId,skipNumberContact)=>{
    return new Promise(async(resolve,reject)=>{
        try {
           let newContacts= await ContactModel.readMoreContactsSent(currentUserId,skipNumberContact,LIMIT_NUMBER_TAKEN);

           let users=newContacts.map(async(contact)=>{
                return await UserModel.getNormalUserDataById(contact.contactId);
           });


            resolve(await Promise.all(users));
        } 
        catch (error) {
            reject(error);
        }
    })
}

let removeRequestContactReceived=(currentUserId,contactId)=>{
    return new Promise(async(resolve,reject)=>{
        let removeRequest=await ContactModel.removeRequestContactReceived(currentUserId,contactId);
        if(removeRequest.result.n===0){
            return reject(false);
        }

        // Tạm thời ko xóa notification
        // remove notification
        //let notifTypeAddContact=NotificationModel.types.ADD_CONTACT;
        //await NotificationModel.model.removeRequestContactReceivedNotification(currentUserId,contactId,notifTypeAddContact);
        resolve(true);
    })
}

let readMoreContactsReceived=(currentUserId,skipNumberContact)=>{
    return new Promise(async(resolve,reject)=>{
        try {
           let newContacts= await ContactModel.readMoreContactsReceived(currentUserId,skipNumberContact,LIMIT_NUMBER_TAKEN);

           let users=newContacts.map(async(contact)=>{
                return await UserModel.getNormalUserDataById(contact.userId);
           });


            resolve(await Promise.all(users));
        } 
        catch (error) {
            reject(error);
        }
    })
}


module.exports={
    findUserContact:findUserContact,
    addNew:addNew,
    removeRequestContactSent:removeRequestContactSent,
    removeRequestContactReceived:removeRequestContactReceived,
    getContacts:getContacts,
    getContactSent:getContactSent,
    getContactReceived:getContactReceived,
    countAllcontacts:countAllcontacts,
    countAllcontactsSent:countAllcontactsSent,
    countAllcontactsReceived:countAllcontactsReceived,
    readMoreContacts:readMoreContacts,
    readMoreContactsSent:readMoreContactsSent,
    readMoreContactsReceived:readMoreContactsReceived
}