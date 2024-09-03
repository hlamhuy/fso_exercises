const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { User, Blog } = require('../models');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  });
  res.json(users);
});

router.post('/', async (req, res) => {
  const { username, name, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    name,
    passwordHash,
  });

  res.json(user);
});

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: { username: req.params.username },
  });
  if (user) {
    user.username = req.body.username || user.username;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
