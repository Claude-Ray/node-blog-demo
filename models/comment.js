'use strict';

const marked = require('marked');
const Comment = require('./index').Comment;

// convert markdown to html
Comment.plugin('contentToHtml', {
  afterFind   : (comments) => {
    return comments.map((comment) => {
      comment.content = marked(comment.content);
      return comment;
    });
  },
  afterFindOne: (comment) => {
    if (comment) {
      comment.content = marked(comment.content);
    }
    return comment;
  }
});

module.exports = {
  // create
  create: function create(comment) {
    return Comment.create(comment).exec();
  },

  // delete a comment
  delCommentById: function delCommentById(commentId, author) {
    return Comment.remove({author: author, _id: commentId}).exec();
  },

  // delete comments by postId
  delCommentsByPostId: function delCommentByPostId(postId) {
    return Comment.remove({postId: postId}).exec();
  },

  // get comments by postId
  getComments: function getComments(postId) {
    return Comment
      .find({postId: postId})
      .populate({path: 'author', model: 'User'})
      .sort({_id: 1})
      .addCreateAt()
      .contentToHtml()
      .exec();
  },

  // get comments' count by postId
  getCommentsCount: function getCommentsCount(postId) {
    return Comment.count({postId: postId}).exec();
  },

  // edit comment by id
  getRawCommentById: function getRawCommentById(commentId) {
    return Comment
      .findOne({_id: commentId})
      .populate({path: 'author', model: 'User'})
      .exec();
  },

  // update comment
  updateCommentById: function updateCommentById(commentId, author, data) {
    return Comment
      .update({author: author, _id: commentId}, {$set: data})
      .exec();
  },
};
