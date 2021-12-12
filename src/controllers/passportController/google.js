import passport from "passport";
import passportGoogle from "passport-google-oauth";
import UserModel from "./../../models/userModel";
import {transErrors, transSuccess} from "./../../../lang/vi";

let GoogleStrategy=passportGoogle.OAuth2Strategy;

let ggAppId=process.env.GG_APP_ID;
let ggAppSecret=process.env.GG_APP_SECRET;
let ggCallbackUrl=process.env.GG_CALLBACK_URL;
/*
Valid userAccount type: Google
*/ 

let initPassportGoogle=()=>{
 passport.use(new GoogleStrategy({
     clientID:ggAppId,
     clientSecret:ggAppSecret,
     callbackURL:ggCallbackUrl,
     passReqToCallback:true
      
 },async (req,accessToken,refreshToken,profile,done)=>{

    try {
        let user=await UserModel.findByGoogleUid(profile.id);
       
        if(user){
            return done(null,user,req.flash("success", transSuccess.loginSuccess(user.username)));
        }
     
        let newUserItem={
            username:profile.displayName,
            gender:profile.gender,
            local:{
                isActive:true
            },
            google:{
                uid: profile.id,
                token: accessToken,
                email:profile.emails[0].value
            }
        };

        let newUser=await UserModel.createNew(newUserItem);
        return done(null,newUser,req.flash("success", transSuccess.loginSuccess(newUser.username)));
        
    }
    catch (error) {
       console.log(error);
       return done(null,false,req.flash("errors", transErrors.server_error));

    }

 }));

 // Save UserId to seesion
 passport.serializeUser((user,done)=>{
    done(null,user._id);
 });

 // this is called by passport.seesion()
 // return userinfo to req.user 
 passport.deserializeUser((id,done)=>{
    UserModel.findUserByIdForSessionToUse(id)
    .then(user=>{
        return done(null,user);
    })
    .catch(error=>{
        return done(error,null);
    })
 });
};

module.exports=initPassportGoogle;