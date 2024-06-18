import passport from 'passport';
import {Strategy} from 'passport-local';
import {mockUsers} from '../utils/constants.mjs';
import {User} from "../mongoose/schemas/user.mjs";
import  {comparePassword} from '../utils/helpers.mjs';

// https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
// only runs once when you try to run login endpoint
passport.serializeUser((user,done)=>{
    console.log("Inside Serializer");
    console.log(user);
    done(null, user.id); // lets store an something that can be used by deserializeUser function search for user
    // here user.id gets saved into session can be accessed as session.id
});

// called whenever you try to acces user from session
passport.deserializeUser(async (id, done)=>{
    console.log("Inside deserializer");
    console.log(`Deserializing user id: ${id}`);
    try{
        // const findUser = mockUsers.find(user => user.id === id); //using local array

        const findUser = await User.findById(id);
        if(!findUser) throw new Error("User not found!");
        done(null, findUser); // done(error, user instance);
    } catch(err){
        done(err, null);
    }
})

export default passport.use(
    // for any fileds other than username
    // new Strategy({usernameField:"email"},(email, password, done)=>{})
    new Strategy(async (username, password, done)=>{
        console.log(`username: ${username} password: ${password}`);
        // search for the user in either database or array
        try{
            // const findUser = mockUsers.find(user => user.username === username); //using local array

            const findUser = await User.findOne({username:username});
            if(!findUser) throw new Error("User not found!");
            if(!comparePassword(password,findUser.password)) throw new Error("Invalid credentials!");
            done(null, findUser); // done(error, user instance);
        } catch(err){
            done(err, null);
        }
    })
);