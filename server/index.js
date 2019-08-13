const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
//router
const usersRouter = require("./api/users.js");
const profile = require("./api/profile.js");
const posts = require("./api/posts.js");
//db
const db = require("../config/db")();

const app = express();

//middleware

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//passport middleware

app.use(passport.initialize());

//passport config
require("./config/passport.js")(passport);

//Use Routes

app.use("/api/users", usersRouter);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running port: ${port}`));
