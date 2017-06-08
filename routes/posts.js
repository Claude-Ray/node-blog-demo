'use strict';

const express = require('express');
const router = express.Router();

const PostModel = require('../models/post');
const CommentModel = require('../models/comments');
const checkLogin = require('../middlewares/check').checkLogin;

// GET /posts display all blogs (all users / one author)
// eg: GET /posts?author=xxx
router.get('/', (req, res, next) => {
  let author = req.query.author;

  PostModel.getPosts(author)
    .then((posts) => {
      res.render('posts', {
        posts: posts
      });
    })
    .catch(next);
});

// GET /posts/create
router.get('/create', checkLogin, (req, res, next) => {
  res.render('create');
});

// POST /posts post action
router.post('/', checkLogin, (req, res, next) => {
  let author = req.session.user._id;
  let title = req.fields.title;
  let content = req.fields.content;

  // check param
  try {
    if (!title.length) {
      throw new Error('请填写标题');
    }
    if (!content.length) {
      throw new Error('请填写内容');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }

  let post = {
    author : author,
    title  : title,
    content: content,
    pv     : 0,
  };

  PostModel.create(post)
    .then((result) => {
      // get post (includes _id) from mongodb
      post = result.opt[0];
      req.flash('success', '发表成功');
      // redirect to this post's page
      res.redirect(`/posts/${post._id}`);
    })
    .catch(next);
});

// GET /posts/:postId single page
router.get('/:postId', (req, res, next) => {
  let postId = req.params.postId;

  Promise.all([
    // get content
    PostModel.getPostById(postId),
    // get comments
    CommentModel.getComments(postId),
    // pv + 1
    PostModel.incPv(postId),
  ])
    .then((result) => {
      let post = result[0];
      let comments = result[1];
      if (!post) {
        throw new Error('该文章不存在');
      }

      res.render('post', {
        post    : post,
        comments: comments
      });
    })
    .catch(next);
});

// GET /posts/:postId/edit
router.get('/:postId/edit', checkLogin, (req, res, next) => {
  let postId = req.params.postId;
  let author = req.session.user._id;

  PostModel.getRawPostById(postId)
    .then((post) => {
      if (!post) {
        throw new Error('该文章不存在');
      }
      if (author.toString() !== post.author._id.toString()) {
        throw new Error('权限不足');
      }
      res.render('edit', {
        post: post
      });
    })
    .catch(next);
});

// POST /posts/:postId/edit
router.post('/:postId/edit', checkLogin, (req, res, next) => {
  let postId = req.params.postId;
  let author = req.session.user._id;
  let title = req.fields.title;
  let content = req.fields.content;

  PostModel.updatePostById(postId, author, {title: title, content: content})
    .then(() => {
      req.flash('success', '文章编辑成功');
      // redirect back
      res.redirect(`/posts/${postId}`);
    })
    .catch(next);
});

// GET /posts/:postId/remove
router.get('/:postId/remove', checkLogin, (req, res, next) => {
  let postId = req.params.postId;
  let author = req.session.user._id;

  PostModel.delPostById(postId, author)
    .then(() => {
      req.flash('success', '文章删除成功');
      // redirect to homepage
      res.redirect('/posts');
    })
    .catch(next);
});

// POST /posts/:postId/comment
router.post('/:postId/comment', checkLogin, (req, res, next) => {
  let author = req.session.user._id;
  let postId = req.params.postId;
  let content = req.fields.content;
  let comment = {
    author : author,
    postId : postId,
    content: content,
  };

  CommentModel.create(comment)
    .then(() => {
      req.flash('success', '留言成功');
      // redirect back
      res.redirect('back');
    })
    .catch(next);
});

// GET /posts/:postId/comment/remove
router.get('/:postId/comment/:commentId/remove', checkLogin, (req, res, next) => {
  let commentId = req.params.commentId;
  let author = req.session.user._id;

  CommentModel.delCommentById(commentId, author)
    .then(() => {
      req.flash('success', '删除留言成功');
      // redirect back
      res.redirect('back');
    })
    .catch(next);
});

module.exports = router;
