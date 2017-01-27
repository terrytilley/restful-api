module.exports = {
  secret: process.env.SECRET,

  mongoURI: {
    development: process.env.DB,
    test: process.env.TEST_DB
  }
};
