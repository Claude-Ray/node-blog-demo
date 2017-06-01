'use strict';

const express = require('express');
const router = express.Router();

const checkLogin = require('../middlewares/check').checkLogin;

// GET /posts display all blogs (all users / one author)
// eg: GET /posts?author=xxx
router.get('/', (req, res, next) => {
  res.send(req.flash());
});

// POST /posts post action
router.get('/', (req, res, next) => {
  res.send(req.flash());
});

// GET /posts/create
router.get('/create', checkLogin, (req, res, next) => {
  res.send(req.flash());
});

// GET /posts/:postId single page
router.get('/:postId', (req, res, next) => {
  res.send(req.flash());
});

// GET /posts/:postId/edit
router.get('/:postId/edit', checkLogin, (req, res, next) => {
  res.send(req.flash());
});

// POST /posts/:postId/edit
router.post('/postId/edit', checkLogin, (req, res, next) => {
  res.send(req.flash());
});

// GET /posts/:postId/remove
router.get('/postId/remove', checkLogin, (req, res, next) => {
  res.send(req.flash());
});

// POST /posts/:postId/comment
router.post('/postId/comment', checkLogin, (req, res, next) => {
  res.send(req.flash());
});

// GET /posts/:postId/comment/remove
router.get('/postId/comment/remove', checkLogin, (req, res, next) => {
  res.send(req.flash());
});

module.exports = router;
