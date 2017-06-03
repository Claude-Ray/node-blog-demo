'use strict';

let User = require('./index').User;

module.exports = {
  // sign up a user
  create: function create(user) {
    return User.create(user).exec();
  },

  // get user
  getUserByName: function getUserByname(name) {
    return User
      .findOne({name: name})
      // create time stamp
      .addCreateAt()
      .exec();
  }
};