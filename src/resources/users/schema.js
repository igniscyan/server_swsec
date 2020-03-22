var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
  username: String,
  password: String,
  userLevel: Number,
  money: Number
});

var User = mongoose.model('users', usersSchema,'users');
module.exports = User; 