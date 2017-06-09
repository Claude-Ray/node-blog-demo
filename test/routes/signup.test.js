'use strict';

const path = require('path');
const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/index').User;

let testName1 = 'testName1';
let testName2 = 'testName2';
describe('signup', () => {
  describe('POST /signup', () => {
    // persist cookie when redirect
    let agent = request.agent(app);
    beforeEach((done) => {
      User.create({
        name    : testName1,
        password: '123456',
        avatar  : '',
        gender  : 'privacy',
        bio     : '',
      })
        .exec()
        .then(() => {
          done();
        })
        .catch(done);
    });

    afterEach((done) => {
      User.remove({name: {$in: [testName1, testName2]}})
        .exec()
        .then(() => {
          done();
        })
        .catch(done);
    });

    it('wrong name', (done) => {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({name: ''})
        .redirects()
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert(res.text.match(/名字长度请限制为1-10个字符/));
          done();
        });
    });

    it('wrong gender', (done) => {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({name: testName2, gender: 'a'})
        .redirects()
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert(res.text.match(/性别只能是male，female或privacy/));
          done();
        });
    });

    it('mismatching password', (done) => {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({name: testName2, gender: 'male', bio: 'noob', password: '123456', repassword: '123457'})
        .redirects()
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert(res.text.match(/两次输入密码不一致/));
          done();
        });
    });

    it('duplicate name', (done) => {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({name: testName1, gender: 'male', bio: 'noob', password: '123456', repassword: '123456'})
        .redirects()
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert(res.text.match(/用户名已被占用/));
          done();
        });
    });

    // signup success
    it('success', (done) => {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({name: testName2, gender: 'male', bio: 'noob', password: '123456', repassword: '123456'})
        .redirects()
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert(res.text.match(/注册成功/));
          done();
        });
    });
  });
});