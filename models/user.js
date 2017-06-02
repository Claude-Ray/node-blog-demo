'use strict';

let User = require('./index').User;

module.exports={
  // sign up a user
  create: function create(user) {
    return User.create(user).exec();
  }
};