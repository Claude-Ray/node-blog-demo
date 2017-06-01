'use strict';

const express = require('express');
const router = express.Router();

const checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup page
router.get('/', checkNotLogin, (req, res, next) => {
  res.send(req.flash());
});

// POST /signup action
router.post('/', checkNotLogin, (req, res, next) => {
  res.send(req.flash());
});

module.exports = router;
