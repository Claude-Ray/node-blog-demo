'use strict';

const config = require('config-lite')(__dirname);
const Mongolass = require('mongolass');
const mongolass = new Mongolass();
mongolass.connect(config.mongodb);

const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');

// get timestamp by id
// the first 4 bit of ObjectId (24 bit) is a timestamp that is accurate to seconds
mongolass.plugin('addCreateAt', {
  afterFind   : (results) => {
    results.forEach((item) => {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
    });
    return results;
  },
  afterFindOne: (result) => {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
    }
    return result;
  }
});

// user model
exports.User = mongolass.model('User', {
  name    : {type: 'string'},
  password: {type: 'string'},
  avatar  : {type: 'string'},
  gender  : {type: 'string', enum: ['male', 'female', 'privacy']},
  bio     : {type: 'string'},
});
// find user by name
exports.User.index({name: 1}, {unique: true}).exec();

// post model
exports.Post = mongolass.model('Post', {
  author : {type: Mongolass.Types.ObjectId},
  title  : {type: 'string'},
  content: {type: 'string'},
  pv     : {type: 'number'},
});
// find posts by userId and time desc
exports.Post.index({author: 1, _id: -1}).exec();

// comment model
exports.Comment = mongolass.model('Comment', {
  author : {type: Mongolass.Types.ObjectId},
  content: {type: 'string'},
  postId : {type: Mongolass.Types.ObjectId},
});
// find comments by postId, time desc
exports.Comment.index({postId: 1, _id: 1}).exec();
// find comments by authorId for delete
exports.Comment.index({author: 1, _id: 1}).exec();
