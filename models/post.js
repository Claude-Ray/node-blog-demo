'use strict';

const marked = require('marked');
const CommentModel = require('./comment');
const Post = require('./index').Post;

// add comments count
Post.plugin('addCommentsCount', {
  afterFind   : (posts) => {
    return Promise.all(posts.map((post) => {
      return CommentModel.getCommentsCount(post._id)
        .then((commentsCount) => {
          post.commentsCount = commentsCount;
          return post;
        });
    }));
  },
  afterFindOne: (post) => {
    if (post) {
      return CommentModel.getCommentsCount(post._id)
        .then((count) => {
          post.commentsCount = count;
          return post;
        });
    }
    return post;
  }
});

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
      .addCommentsCount()
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
      .addCommentsCount()
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
  delPostById: function delPostById(postId, author) {
    return Post
      .remove({author, _id: postId})
      .exec()
      .then((res) => {
        // delete all comments
        if (res.result.ok && res.result.n > 0) {
          return CommentModel.delCommentsByPostId(postId);
        }
      });
  },
};
