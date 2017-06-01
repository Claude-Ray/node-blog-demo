'use strict';

const path = require('path');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const config = require('config-lite')(__dirname);
const MongoStore = require('connect-mongo')(session);
const routes = require('./routes');
const pkg = require('./package');

let app = express();

// view engine setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

// static files
app.use(express.static(path.join(__dirname,'public')));
// session
app.use(session({
  name: config.session.key,
  secret: config.session.secret,
  resave: true,
  saveUninitialized:false,
  cookie:{
    maxAge:config.session.maxAge
  },
  store:new MongoStore({
    url: config.mongodb
  })
}));

// flash
app.use(flash());

// routes
routes(app);

// start
app.listen(config.port,()=>{
  console.log(`${pkg.name} listening on port ${config.port}`);
});
