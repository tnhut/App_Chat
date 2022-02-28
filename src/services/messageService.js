import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import ChatGroupModel from "./../models/chatGroupModel";
import MessageModel from "./../models/messageModel";
import _ from "lodash";
import { transErrors } from "../../lang/vi";
import {app} from "./../config/app";
import { reject, resolve } from "bluebird";

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

let addNewTextEmoji=(sender,receiverId,messageVal,isChatGroup)=>{
    return new Promise(async(resolve,reject)=>{
        try {
           if(isChatGroup){
                let getChatGroupReceiver= await ChatGroupModel.getChatGroupById(receiverId);
                if(!getChatGroupReceiver){
                    return reject(transErrors.conversation_not_found);
                }
                let receiver={
                    id:getChatGroupReceiver._id,
                    name:getChatGroupReceiver.name,
                    avatar:app.general_avatar_group_chat
                };

                let newMessageItem={
                    senderId:sender.id,
                    receiverId:receiver.id,
                    conversationType:MessageModel.conversationTypes.GROUP,
                    messageType:MessageModel.messageTypes.TEXT,
                    sender: sender,
                    receiver:receiver,
                    text: messageVal,
                    createdAt:Date.now()               
                };
                 // Create message
                let newMessage=await MessageModel.model.createNew(newMessageItem);

                 //Update group chat
                await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id,
                    getChatGroupReceiver.messageAmount+1);

                resolve(newMessage);
               
           }
           else{
                let getUserReceiver= await UserModel.getNormalUserDataById(receiverId);
                if(!getUserReceiver){
                    return reject(transErrors.conversation_not_found);
                }

                let receiver={
                    id:getUserReceiver._id,
                    name:getUserReceiver.username,
                    avatar:getUserReceiver.avatar
                };

                let newMessageItem={
                    senderId:sender.id,
                    receiverId:receiver.id,
                    conversationType:MessageModel.conversationTypes.PERSONAL,
                    messageType:MessageModel.messageTypes.TEXT,
                    sender: sender,
                    receiver:receiver,
                    text: messageVal,
                    createdAt:Date.now()               
                };
                // Create message
                let newMessage=await MessageModel.model.createNew(newMessageItem);
                // Update contact
                await ContactModel.updateWhenHasNewMessage(sender.id,getUserReceiver._id);

                resolve(newMessage);
               
           }
        } 
        catch (error) {
            reject(error);
        }
    })
};

module.exports={
    getAllConversationItems:getAllConversationItems,
    addNewTextEmoji:addNewTextEmoji
}