module.exports = {
  secret: 'superSecretPassphrase',
  mongoURI: {
    development: process.env.DB,
    test: process.env.TEST_DB
  }
};
