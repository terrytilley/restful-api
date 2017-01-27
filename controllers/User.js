const User = require('../models/User');
const setUserInfo = require('../helpers').setUserInfo;

exports.viewProfile = function (req, res, next) {
  const userId = req.params.userId;

  User.findById(userId, (err, user) => {
    if (err) {
      res.status(400).json({ error: 'No user could be found for this ID.' });
      return next(err);
    }

    const userToReturn = setUserInfo(user);

    return res.status(200).json({ user: userToReturn });
  });
};

exports.editProfile = function (req, res, next) {
  const userId = req.params.userId;

  if (req.user._id.toString() !== userId) { return res.status(401).json({ error: 'You are not authorized to edit this profile.' }); }
  User.findById(userId, (err, user) => {
    if (err) {
      res.status(400).json({ error: 'No user could be found for this ID.' });
      return next(err);
    }

    user.profile.firstName = req.body.firstName;
    user.profile.lastName = req.body.lastName;
    user.updatedAt = Date.now();

    user.save((err) => {
      if (err) { res.send(err); }
      return res.status(200).json({ message: 'Profile updated.', user });
    });
  });
};
