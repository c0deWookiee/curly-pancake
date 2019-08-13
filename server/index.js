const express = require('express');
const path = require('path');
const port = process.env.PORT || 27015;
const bodyParser = require('body-parser');
const app = express();
const router = require('./routes.js');
const connectDB = require('../config/db');

connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', router);

app.use(express.static(path.resolve(__dirname, '/../dist')));

app.listen(port, () => {
  console.log('hello on port ' + port);
});
