'use strict';

const marked = require('marked');
let Post = require('./index').Post;

// convert markdown to html
Post.plugin('contentToHtml', {
  afterFind   : (posts) => {
    return posts.map((post) => {
      post.content = marked(post.content);
      return post;
    });
  },
  afterFindOne: (post) => {
    if (post) {
      post.content = marked(post.content);
    }
    return post;
  }
});

module.exports = {
  // create
  create: function create(post) {
    return Post.create(post).exec();
  },

  // get one post
  getPostById: function getPostById(postId) {
    return Post
      .findOne({_id: postId})
      .populate({path: 'author', model: 'User'})
      .addCreateAt()
      .contentToHtml()
      .exec();
  },

  // get posts by author, desc
  getPosts: function getPosts(author) {
    let query = {};
    if (author) {
      query.author = author;
    }
    return Post
      .find(query)
      .populate({path: 'author', model: 'User'})
      .sort({_id: -1})
      .addCreateAt()
      .contentToHtml()
      .exec();
  },

  // pv + 1
  incPv: function incPv(postId) {
    return Post
      .update({_id: postId}, {$inc: {pv: 1}})
      .exec();
  },

  // edit post by id
  getRawPostById: function getRawPostById(postId) {
    return Post
      .findOne({_id: postId})
      .populate({path: 'author', model: 'User'})
      .exec();
  },

  // update post
  updatePostById: function updatePostById(postId, author, data) {
    return Post
      .update({author: author, _id: postId}, {$set: data})
      .exec();
  },

  // delete post
  delPostById: function delPostById(postId,author) {
    return Post
      .remove({author,_id:postId})
      .exec();
  },
};
