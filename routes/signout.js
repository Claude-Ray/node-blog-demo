'use strict';

const express = require('express');
const router = express.Router();

const checkLogin = require('../middlewares/check').checkLogin;

// GET /signout action
router.get('/', checkLogin, (req, res, next) => {
  // clear session.user
  req.session.user = null;
  req.flash('success','登出成功');
  // redirect to homepage
  res.redirect('/posts');
});

module.exports = router;

