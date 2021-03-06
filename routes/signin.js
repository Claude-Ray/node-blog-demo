'use strict';

const express = require('express');
const router = express.Router();
const sha1 = require('sha1');

const checkNotLogin = require('../middlewares/check').checkNotLogin;
const UserModel = require('../models/user');

// GET /signin page
router.get('/', checkNotLogin, (req, res, next) => {
  res.render('signin');
});

// POST /signin action
router.post('/', checkNotLogin, (req, res, next) => {
  let name = req.fields.name;
  let password = req.fields.password;

  UserModel.getUserByName(name)
    .then((user) => {
      if (!user) {
        req.flash('error', '用户不存在');
        return res.redirect('back');
      }

      // check password
      if (sha1(password) !== user.password) {
        req.flash('error', '用户名或密码错误');
        return res.redirect('back');
      }

      req.flash('success', '登录成功');

      // write session
      delete user.password;
      req.session.user = user;

      // redirect to homepage
      res.redirect('/posts');
    })
    .catch(next);
});

module.exports = router;
