import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from 'express-session';
import { mockUsers } from "./utils/constants.mjs";
import passport from "passport";
import mongoose from "mongoose";
// import './Strategies/local-strategy.mjs';
import './Strategies/discord-strategy.mjs';
import MongoStore from 'connect-mongo';
import dotenv from "dotenv";

dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DATABASE_URL)
      .then(()=>{console.log("Connected to Database")})
      .catch((err)=>{console.log(err)});

//  MIDDLEWARE
// Middlewares must be registered before routes
// for registering globally
app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(session({
  secret: "any strong secret",
  saveUninitialized: false, // if user just visits any enpoint and not saving anything regarding user, it will ony save new session data when it is modified
  resave: false,
  cookie: {
    maxAge: 60000 * 60,
  },
  store:MongoStore.create({
    client: mongoose.connection.getClient(),
  })
}));

//must be done after you initialize sessions
app.use(passport.initialize());
app.use(passport.session()); // will dynamacally allocate a user which can be accessed by simply referencing the user

app.use(routes);

// GET Requests
// .get(path, request handler function)
// registering middleware for specific url
app.get('/', (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  req.session.visited = true; // wil keep same session id
  res.cookie("hello", "World", { maxAge: 30000, signed: true });
  res.send("Hello World");
});


app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});