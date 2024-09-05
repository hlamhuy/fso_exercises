const jwt = require('jsonwebtoken');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { SECRET } = require('../util/config');
const { User, Sessions } = require('../models');

router.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({
    where: { username: username },
  });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  if (user.disabled) {
    return response.status(401).json({
      error: 'account disabled, please contact admin',
    });
  } else {
    await Sessions.create({
      userId: user.id,
      token: token,
    });
  }
  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = router;
