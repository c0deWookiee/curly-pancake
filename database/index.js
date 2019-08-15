var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('mongoose connected!');
});
//   "mongoURI": "mongodb+srv://alixlii:alixlii@cluster0-hqeub.mongodb.net/test?retryWrites=true&w=majority",
