'use strict';

const config = require('config-lite')(__dirname);
const Mongolass = require('mongolass');

let mongolass = new Mongolass();
mongolass.connect(config.mongodb);

// user model
exports.User = mongolass.model('User',{
  name:{type:'string'},
  password:{type:'string'},
  avatar:{type:'string'},
  gender:{type:'string',enum:['m','f','x']},
  bio:{type:'string'},
});
// find user by name
exports.User.index({name:1},{unique:true}).exec();
