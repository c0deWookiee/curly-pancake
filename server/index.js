const express = require('express');
const path = require('path');
const port = process.env.PORT || 27015;
const bodyParser = require('body-parser');

//routes
const usersRoute = require('./api/users.js');
const profileRoute = require('./api/profile.js');
const postRoute = require('./api/post.js');
const authRoute = require('./api/auth.js');

const app = express();
//database connection
const connectDB = require('../config/db');
connectDB();

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//end points
app.use('/api/users', usersRoute); //users post to this route to register their accounts
app.use('/api/profile', profileRoute);
app.use('/api/post', postRoute);
app.use('/api/auth', authRoute);

//serve static
app.use(express.static(path.resolve(__dirname, '/../dist')));

app.listen(port, () => console.log(`server running port: ${port}`));
