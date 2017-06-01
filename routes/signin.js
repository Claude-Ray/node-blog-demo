'use strict';

const express = require('express');
const router = express.Router();

const checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signin page
router.get('/', checkNotLogin, (req, res, next) => {
  res.send(req.flash());
});

// GET /signin action
router.get('/', checkNotLogin, (req, res, next) => {
  res.send(req.flash());
});

module.exports = router;
