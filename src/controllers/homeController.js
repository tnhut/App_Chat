import {notification,contact, message} from "./../services/index";
import {bufferToBase64, lastItemOfArray,convertTimestampToHumanTime} from "./../helpers/clientHelper";
import request from "request";

let getICETurnServer=()=>{
    return new Promise(async (resolve,reject)=>{
        // Node Get ICE STUN and TURN list
        let o = {
            format: "urls"
        };

        let bodyString = JSON.stringify(o);
       
        let options = {
            url:"https://global.xirsys.net/_turn/AppChat",
            // host: "global.xirsys.net",
            // path: "/_turn/AppChat",
            method: "PUT",
            headers: {
                "Authorization": "Basic " + Buffer.from("thanhnhut:d35c79f8-1022-11ed-ae0c-0242ac150002").toString("base64"),
                "Content-Type": "application/json",
                "Content-Length": bodyString.length
            }
        };

        //Call request to get ICE list  TurnServer
        request(options, (error,response,body)=>{
            if(error){
                console.log("Error when call api get ICE "+ error);
                return reject(error);
            }
            let bodyJson=JSON.parse(body);
            resolve(bodyJson.v.iceServers)
        });

        
    });
};

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
  
   // get all message 
   let allConversationWithMessage=getAllConversationItems.allConversationWithMessage;

   // get ICE List from turnserver
   let iceServerList=await getICETurnServer();

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
        allConversationWithMessage:allConversationWithMessage,
        bufferToBase64:bufferToBase64,
        lastItemOfArray:lastItemOfArray,
        convertTimestampToHumanTime:convertTimestampToHumanTime,
        iceServerList:JSON.stringify(iceServerList)
    });
};

module.exports={
    getHome:getHome
};