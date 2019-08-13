const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

module.exports = async () => {
  try {
    await mongoose.connect(db);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
