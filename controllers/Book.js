const mongoose = require('mongoose');
const Book = require('../models/Book');

exports.getBooks = function(req, res, next) {
  let query = Book.find({});
  query.exec((err, books) => {
    if (err) res.send(err);

    res.json(books);
  });
};

exports.postBook = function(req, res, next) {
  let newBook = new Book(req.body);
  newBook.save((err, book) => {
    if (err) {
      res.send(err);
    } else {
      res.json({ message: "Book successfully added!", book });
    }
  });
};

exports.getBook = function(req, res, next) {
  Book.findById(req.params.id, (err, book) => {
    if (err) res.send(err);

    res.json(book);
  });
};

exports.deleteBook = function(req, res, next) {
  Book.remove({ _id: req.params.id }, (err, result) => {
    res.json({ message: "Book successfully deleted!", result });
  });
};

exports.updateBook = function(req, res, next) {
  Book.findById({ _id: req.params.id }, (err, book) => {
    if (err) res.send(err);
    Object.assign(book, req.body).save((err, book) => {
      if (err) res.send(err);

      res.json({ message: "Book updated!", book });
    });
  });
};
