import {contact} from "./../services/index";
import {validationResult} from "express-validator/check";

let findUserContact=async(req,res)=>{
    let errorArr=[];
     let validationErrors=validationResult(req);
     if(!validationErrors.isEmpty()){
        let errors=Object.values(validationErrors.mapped());
        errors.forEach(item=>{
            errorArr.push(item.msg)
        })       
        
        return res.status(500).send(errorArr);
     }

    try {
        let currentUserId=req.user._id;
        let keyword=req.params.keyword;

        let users=await contact.findUserContact(currentUserId,keyword);
        return res.render("main/contact/sections/_findUsersContact",{users});
    } 
    catch (error) {
        return res.status(500).send(error);
    }
};

let addNew=async(req,res)=>{
    
    try {
        let currentUserId=req.user._id;
        let contactId=req.body.uid;

        let newContact=await contact.addNew(currentUserId,contactId);
        // !!newContact tra về true hoac fale( co ton tai newContact=>true)
        return res.status(200).send({success:!!newContact});

    } 
    catch (error) {
        return res.status(500).send(error);
    }
};

let removeRequestContact=async(req,res)=>{
    
    try {
        let currentUserId=req.user._id;
        let contactId=req.body.uid;

        let removeReq=await contact.removeRequestContact(currentUserId,contactId);
        // !!newContact tra về true hoac fale( co ton tai newContact=>true)
        return res.status(200).send({success:!!removeReq});

    } 
    catch (error) {
        return res.status(500).send(error);
    }
};

module.exports={
    findUserContact:findUserContact,
    addNew:addNew,
    removeRequestContact:removeRequestContact
}