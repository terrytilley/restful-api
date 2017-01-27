process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const User     = require('../models/User');

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../index');
const should   = chai.should();

chai.use(chaiHttp);

describe('******** Users ********', () => {
  beforeEach((done) => {
    User.remove({}, (err) => {
      done();
    });
  });

  after((done) => {
    User.collection.drop();
    done();
  });

  describe('/GET /api/user/:userId', () => {
    it('it should GET a user by the given id', (done) => {
      let user = new User({
        "email": "john@doe.com",
        "password": "superSecretPassword",
        "firstName": "John",
        "lastName": "Doe"
      });
      user.save((err, user) => {
        chai.request(server)
          .get(`/api/user/${user.id}`)
          .send(user)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.user.should.have.property('_id').eql(user.id);
            done();
          });
      });
    });
  });
});
