import { Router } from "express";
import {mockUsers} from '../utils/constants.mjs';

const router = Router();

// normal authentication by storing user object in session
router.post('/api/sessionauth', (req, res)=>{
  const {body:{username, password}} = req;
  const findUser = mockUsers.find(user=> user.username === username);
  if(!findUser || (findUser.password !== password)) return res.status(401).send({msg: "BAD CREDENTIALS!"});
  
  req.session.user = findUser; // saving user data for this session
  return res.status(200).send(findUser);
});

router.get('/api/sessionauth/status', (req, res)=>{
  // showing how the user is saved in session data
  req.sessionStore.get(req.sessionID, (err, session)=>{
    console.log(session);
  });
  if(req.session.user) return res.status(200).send(req.session.user);
  return res.status(401).send({msg: "NOT AUTHENTICATED!"}); 
});

router.post('/api/cart', (req, res)=>{
  if(!req.session.user) return res.status(401).send({msg: "User Not Authenticated!"});
  const {body: item} = req;
  const {cart} = req.session;
  if(cart) cart.push(item);
  else{
    req.session.cart = [item];
  }
  
  return res.status(201).send(item);
});

router.get('/api/cart', (req, res)=>{
  if(!req.session.user) return res.status(401).send({msg: "User Not Authenticated!"});
  return res.send(req.session.cart ?? []);
})

export default router;