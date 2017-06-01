'use strict';

module.exports = {
  port   : 3000,
  session: {
    secret: 'blog-demo',
    key   : 'blog-demo',
    maxAge: 2592000000,
  },
  mongodb: 'mongodb://localhost:27017/blog-demo',
};
