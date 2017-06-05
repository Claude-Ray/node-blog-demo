'use strict';

const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const config = require('config-lite')(__dirname);
const routes = require('./routes');
const pkg = require('./package');
const winston = require('winston');
const expressWinston = require('express-winston');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// static files
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(session({
  name             : config.session.key,
  secret           : config.session.secret,
  resave           : true,
  saveUninitialized: false,
  cookie           : {
    maxAge: config.session.maxAge,
  },
  store            : new MongoStore({
    url: config.mongodb,
  })
}));

// flash
app.use(flash());

// file upload
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img')
}));

// express 自动 merge 并传入了模板，因此可以在模板中直接使用这些变量
// global var
app.locals.blog = {
  title      : pkg.name,
  description: pkg.description,
};

// ejs var
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});

// formal logs
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json    : true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'log/success.log'
    })
  ]
}));

// log -> routes ->errorLog
// routes
routes(app);

// error logs
app.use(expressWinston.errorLogger({
  transports: [
    new (winston.transports.Console)({
      json    : true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'log/error.log'
    })
  ]
}));

// error page
app.use((err, req, res, next) => {
  res.render('error', {
    error: err,
  });
});

// start
app.listen(config.port, () => {
  console.log(`${pkg.name} listening on port ${config.port}`);
});
