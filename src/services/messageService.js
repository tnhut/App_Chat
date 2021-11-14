import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import ChatGroupModel from "./../models/chatGroupModel";
import _ from "lodash";

const LIMIT_CONVERSATIONS_TAKEN=15;

let getAllConversationItems=(currentUserId)=>{
    return new Promise(async(reslove,reject)=>{
        try {
            
            let contacts=await ContactModel.getContacts(currentUserId,LIMIT_CONVERSATIONS_TAKEN);
            let usersConversationsPromise=contacts.map(async(contact)=>{
               
                if(contact.contactId==currentUserId){
                   
                    let getUserContact= await UserModel.getNormalUserDataById(contact.userId);                
                    getUserContact.createAt=contact.createAt;
                    return getUserContact;
                }
                else{
                    
                    let getUserContact= await UserModel.getNormalUserDataById(contact.contactId);
                    getUserContact.createAt=contact.createAt;
                    return getUserContact;
                }
            })

            let usersConversations= await Promise.all(usersConversationsPromise);
            let groupConversations=await ChatGroupModel.getChatGroups(currentUserId,LIMIT_CONVERSATIONS_TAKEN);
            let allConversations=usersConversations.concat(groupConversations);
            // Sort by desc
            allConversations=_.sortBy(allConversations,(item)=>{
                return -item.createAt;
            })
            reslove(
                {
                    usersConversations:usersConversations,
                    groupConversations:groupConversations,
                    allConversations:allConversations                
                }
            );

        } catch (error) {
            reject(error);
        }
    })
};

module.exports={
    getAllConversationItems:getAllConversationItems
}