import {notification,contact, message} from "./../services/index";
import {bufferToBase64} from "./../helpers/clientHelper";

let getHome=async(req,res)=>{
   // Get 10 item once
   let notifications=await notification.getNotifications(req.user._id);
   // get amout notification unread
   let countNotifUnread=await notification.countNotifUnread(req.user._id);
   //get contact 10 item for one time
   let contacts=await contact.getContacts(req.user._id);  
   //get contact sent item for one time
   let contactSent=await contact.getContactSent(req.user._id);
   //get contact receive item for one time
   let contactReceived=await contact.getContactReceived(req.user._id);
   // count contacts
   let countAllcontacts=await contact.countAllcontacts(req.user._id);
   let countAllcontactsSent=await contact.countAllcontactsSent(req.user._id);
   let countAllcontactsReceived=await contact.countAllcontactsReceived(req.user._id);
   
   let getAllConversationItems= await message.getAllConversationItems(req.user._id);
   let allConversations=getAllConversationItems.allConversations;
   let usersConversations=getAllConversationItems.usersConversations;
   let groupConversations=getAllConversationItems.groupConversations;
   // get all message 
   let allConversationWithMessage=getAllConversationItems.allConversationWithMessage;
    return res.render("main/home/home",{
        errors: req.flash("errors"),
        success: req.flash("success"),
        user:req.user,
        notifications:notifications,
        countNotifUnread:countNotifUnread,
        contacts:contacts,
        contactSent:contactSent,
        contactReceived:contactReceived,
        countAllcontacts:countAllcontacts,
        countAllcontactsSent:countAllcontactsSent,
        countAllcontactsReceived:countAllcontactsReceived,
        allConversations:allConversations,
        usersConversations:usersConversations,
        groupConversations:groupConversations,
        allConversationWithMessage:allConversationWithMessage,
        bufferToBase64:bufferToBase64
    });
};

module.exports={
    getHome:getHome
};