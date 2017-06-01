'use strict';

const express = require('express');
const router = express.Router();

const checkLogin = require('../middlewares/check').checkLogin;

// GET /signout action
router.get('/', checkLogin, (req, res, next) => {
  res.send(req.flash());
});

module.exports = router;

