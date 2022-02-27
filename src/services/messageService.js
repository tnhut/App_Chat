import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import ChatGroupModel from "./../models/chatGroupModel";
import MessageModel from "./../models/messageModel";
import _ from "lodash";

const LIMIT_CONVERSATIONS_TAKEN=15;
const LIMIT_MESSAGE_TAKEN=30;

let getAllConversationItems=(currentUserId)=>{
    return new Promise(async(reslove,reject)=>{
        try {
            
            let contacts=await ContactModel.getContacts(currentUserId,LIMIT_CONVERSATIONS_TAKEN);
            let usersConversationsPromise=contacts.map(async(contact)=>{
               
                if(contact.contactId==currentUserId){
                   
                    let getUserContact= await UserModel.getNormalUserDataById(contact.userId);                
                    getUserContact.updatedAt=contact.updatedAt;
                    return getUserContact;
                }
                else{
                    
                    let getUserContact= await UserModel.getNormalUserDataById(contact.contactId);
                    getUserContact.updatedAt=contact.updatedAt;
                    return getUserContact;
                }
            })

            let usersConversations= await Promise.all(usersConversationsPromise);
            let groupConversations=await ChatGroupModel.getChatGroups(currentUserId,LIMIT_CONVERSATIONS_TAKEN);
            let allConversations=usersConversations.concat(groupConversations);
            // Sort by desc
            allConversations=_.sortBy(allConversations,(item)=>{
                return -item.updatedAt;
            });
            // Get message to apply screenchat
            let allConversationWithMessagePromise=allConversations.map(async(conversation)=>{
                conversation=conversation.toObject();
                if(conversation.members){
                    let getMessage=await MessageModel.model.getMessagesInGroup(conversation._id,LIMIT_MESSAGE_TAKEN);
                    conversation.messages=getMessage;
                }
                else{
                    let getMessage=await MessageModel.model.getMessagesInPersonal(currentUserId,conversation._id,LIMIT_MESSAGE_TAKEN);
                    conversation.messages=getMessage;
                }
              
                       
                return conversation;
            });
            
            let allConversationWithMessage=await Promise.all(allConversationWithMessagePromise);
            //Sort by updatedat desc
            allConversationWithMessage=_.sortBy(allConversationWithMessage, (item)=>{
                return -item.updatedAt;
            })
            reslove(
                {
   
                    allConversationWithMessage:allConversationWithMessage              
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