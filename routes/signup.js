'use strict';

const fs = require('fs');
const path = require('path');
const sha1 = require('sha1');
const express = require('express');
const router = express.Router();

const UserModel = require('../models/user');
const checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup page
router.get('/', checkNotLogin, (req, res, next) => {
  res.render('signup');
});

// POST /signup action
router.post('/', checkNotLogin, (req, res, next) => {
  let name = req.fields.name;
  let gender = req.fields.gender;
  let bio = req.fields.bio;
  let avatar = req.files.avatar.path.split(path.sep).pop();
  let password = req.fields.password;
  let repassword = req.fields.repassword;

  // check param
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字长度请限制为1-10个字符');
    }
    if (['male', 'female', 'privacy'].indexOf(gender) === -1) {
      throw new Error('性别只能是male，female或privacy');
    }
    if (bio.length < 1 || bio.length > 30) {
      throw new Error('签名请限制为1-30个字符');
    }
    if (!req.files.avatar.name) {
      throw new Error('缺少头像');
    }
    if (password.length < 6) {
      throw new Error('密码长度不小于6个字节');
    }
    if (password !== repassword) {
      throw new Error('两次输入密码不一致');
    }
  } catch (e) {
    // sign up failed, delete avatar
    fs.unlink(req.files.avatar.path);
    req.flash('error', e.message);
    return res.redirect('/signup');
  }

  // hash password
  password = sha1(password);

  // user data
  let user = {
    name    : name,
    password: password,
    gender  : gender,
    bio     : bio,
    avatar  : avatar,
  };

  // write user
  UserModel.create(user)
    .then((result) => {
      user = result.ops[0];
      delete user.password;
      req.session.user = user;
      req.flash('success', '注册成功');
      res.redirect('/posts');
    })
    .catch((e) => {
      fs.unlink(req.files.avatar.path);
      if (e.message.match('E11000 duplicate key')) {
        req.flash('error', '用户名已被占用');
        return res.redirect('/signup');
      }
      next(e);
    });
});

module.exports = router;
