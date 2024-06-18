import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from '../mongoose/schemas/discord-user.mjs';
import { comparePassword } from "../utils/helpers.mjs";

//the user arguement is what we got from the done in the strategy below
//this functions serializes the user into the session object, gives us an ability to store user however we want into session
//in this case we will be using autogenerated object id
passport.serializeUser((user,done)=>{
    console.log("Inside Serializer");
    console.log(user);
    done(null,user.id);
});

//this function goes and tries to find our user in the sessionstore and provides it to requests
//it uses whatever we used in serializer to find object
passport.deserializeUser(async (id,done)=>{
    console.log("Inside Deserializer");
    try{
        const findUser = await DiscordUser.findById(id);
        return findUser ? done(null, findUser) : done(null, null); //here we are passing null,null since we weren't able to find the user in session store
    } catch(err){
        done(err, null);
    }
});

export default passport.use(
    new Strategy({
        clientID: process.env.DISCORD_CLIENT,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: process.env.DISCORD_REDIRECT_URI,
        scope: ['identify'],
    },
        async (accessToken, refreshToken, profile, done) => {
            //discord uses the access token to verify and retrive info for the user
            //refresh token is used to update the access token
            console.log(profile);
            let findUser;
            try{
                findUser = await DiscordUser.findOne({ discordId: profile.id });
            } catch(err){
                done(err, null)
            }

            try {
                if (!findUser) {
                    const newUser = new DiscordUser({ username: profile.username, discordId: profile.id });
                    const newSaveduser = await newUser.save();
                    return done(null, newSaveduser); //this tells passport to serialize this user into session data
                }
                return done(null, findUser);
            } catch (err) {
                console.log(err);
                done(err, null);
            }
        })
);