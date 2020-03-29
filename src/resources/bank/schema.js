var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bankerSchema = new Schema({
  username: String,
  userId: Number,
  level: Number,
  money: Number
});

var Bankers = mongoose.model('bank', usersSchema,'bank');
module.exports = Bankers; 