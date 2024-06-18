import passport from "passport";
// import '../Strategies/local-strategy.mjs';
import '../Strategies/discord-strategy.mjs';
import {Router} from "express";   

const router = Router();

// using passport authentication, it stores user object in passport
router.post('/api/auth', passport.authenticate('local'),(req,res)=>{
  res.sendStatus(200);
});

router.get('/api/auth/status',(req, res)=>{
  console.log("Inside /auth/status endpoint");
  console.log(req.user); // this uses deserializer function to find the user
  console.log(req.session);
  if(req.user) res.send(req.user);
  else res.status(401).send({msg: "user not authorized(pass)"});
});

router.post('/api/auth/logout', (req, res)=>{
  if(!req.user) res.sendStatus(401);
  req.logout((err)=>{
    if(!err) return res.sendStatus(200);
    return res.sendStatus(400);
  })
});

router.get('/api/auth/discord', passport.authenticate('discord'),(req, res)=>{
  res.sendStatus(200);
});

router.get('/api/auth/discord/redirect',passport.authenticate('discord'),(req,res)=>{
  console.log("Redirected by user");
  console.log(req.session);
  res.sendStatus(200);
});

export default router;
  