'use strict';

const marked = require('marked');
const Comment = require('./index').Comment;

// convert markdown to html
Comment.plugin('contentToHtml', {
  afterFind: (comments) => {
    return comments.map((comment) => {
      comment.content = marked(comment.content);
      return comment;
    });
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
  delCommentByPostId: function delCommentByPostId(postId) {
    return Comment.remove({postId: postId}).exec();
  },

  // get comments by postId
  
  // get comments' count by postId

};
