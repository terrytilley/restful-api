const BookController = require('./controllers/Book');

const express = require('express');

module.exports = function(app) {
  const apiRoutes  = express.Router();
  const bookRoutes = express.Router();

  //= ========================
  // Book Routes
  //= ========================
  apiRoutes.use('/book', bookRoutes);

  bookRoutes.get('/', BookController.getBooks);
  bookRoutes.post('/', BookController.postBook);

  bookRoutes.get('/:id', BookController.getBook);
  bookRoutes.put('/:id', BookController.updateBook);
  bookRoutes.delete('/:id', BookController.deleteBook);

  //= ========================
  // Api Routes
  //= ========================
  apiRoutes.get('/', function(req, res) {
    res.json({message: "Welcome to our Bookstore!"});
  });

  // Set url for API group routes
  app.use('/api', apiRoutes);
};
