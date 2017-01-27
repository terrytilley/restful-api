process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const Book     = require('../models/Book');

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../index');
const should   = chai.should();

chai.use(chaiHttp);

describe('******** Books ********', () => {
  beforeEach((done) => {
    Book.remove({}, (err) => {
      done();
    });
  });

  after((done) => {
    Book.collection.drop();
    done();
  });

  describe('GET /api/book', () => {
    it('it should GET all the books', (done) => {
      chai.request(server)
        .get('/api/book')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('POST /api/book', () => {
    it('it should not POST a book without pages field', (done) => {
      let book = {
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        year: 1954
      };
      chai.request(server)
        .post('/api/book')
        .send(book)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('pages');
          res.body.errors.pages.should.have.property('kind').eql('required');
          done();
        });
    });

    it('it should POST a book', (done) => {
      let book = {
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        year: 1954,
        pages: 1170
      };
      chai.request(server)
        .post('/api/book')
        .send(book)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Book successfully added!');
          res.body.book.should.have.property('title');
          res.body.book.should.have.property('author');
          res.body.book.should.have.property('pages');
          res.body.book.should.have.property('year');
          done();
        });
    });
  });

  describe('/GET /api/book/:id', () => {
    it('it should GET a book by the given id', (done) => {
      let book = new Book({ title: "The Lord of the Rings", author: "J.R.R. Tolkien", year: 1954, pages: 1170 });
      book.save((err, book) => {
        chai.request(server)
          .get(`/api/book/${book.id}`)
          .send(book)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('author');
            res.body.should.have.property('pages');
            res.body.should.have.property('year');
            res.body.should.have.property('_id').eql(book.id);
            done();
          });
      });
    });
  });

  describe('/PUT /api/book/:id', () => {
    it('it should UPDATE a book given the id', (done) => {
      let book = new Book({ title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778 });
      book.save((err, book) => {
        chai.request(server)
          .put(`/api/book/${book.id}`)
          .send({ title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1950, pages: 778 })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Book updated!');
            res.body.book.should.have.property('year').eql(1950);
            done();
          });
      });
    });
  });

  describe('/DELETE /api/book/:id', () => {
    it('it should DELETE a book given the id', (done) => {
      let book = new Book({ title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778 });
      book.save((err, book) => {
        chai.request(server)
          .delete(`/api/book/${book.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Book successfully deleted!');
            res.body.result.should.have.property('ok').eql(1);
            res.body.result.should.have.property('n').eql(1);
            done();
          });
      });
    });
  });
});
