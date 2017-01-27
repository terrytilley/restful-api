process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const User     = require('../models/User');

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../index');
const should   = chai.should();

chai.use(chaiHttp);

describe('******** Authentication ********', () => {
  after((done) => {
    User.collection.drop();
    done();
  });

  describe('POST /api/auth/register', () => {
    it('it should not register a user without an email', (done) => {
      let user = {
        password: "superSecretPassword",
        firstName: "John",
        lastName: "Doe"
      };
      chai.request(server)
        .post('/api/auth/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('You must enter an email address.');
          done();
        });
    });

    it('it should not register a user without a password', (done) => {
      let user = {
        email: "john@doe.com",
        firstName: "John",
        lastName: "Doe"
      };
      chai.request(server)
        .post('/api/auth/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('You must enter a password.');
          done();
        });
    });

    it('it should not register a user without a full name', (done) => {
      let user = {
        email: "john@doe.com",
        password: "superSecretPassword"
      };
      chai.request(server)
        .post('/api/auth/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('You must enter your full name.');
          done();
        });
    });

    it('it should register a user', (done) => {
      let user = {
        email: "john@doe.com",
        password: "superSecretPassword",
        firstName: "John",
        lastName: "Doe"
      };
      chai.request(server)
        .post('/api/auth/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.user.should.have.property('firstName', 'John');
          res.body.user.should.have.property('lastName', 'Doe');
          res.body.should.have.property('token');
          done();
        });
    });
  });

  describe('POST /api/auth/login', () => {
    it('it should login a user', (done) => {
      let user = {
        email: "john@doe.com",
        password: "superSecretPassword"
      };
      chai.request(server)
        .post('/api/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.user.should.have.property('email', 'john@doe.com');
          res.body.user.should.have.property('firstName', 'John');
          res.body.user.should.have.property('lastName', 'Doe');
          res.body.should.have.property('token');
          done();
        });
    });
  });
});
