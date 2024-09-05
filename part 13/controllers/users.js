const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { User, Blog } = require('../models');
const { Op } = require('sequelize');

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

router.get('/:id', async (req, res) => {
  const where = {};
  if (req.query.read) {
    let rd;
    if (req.query.read === 'true') rd = true;
    else if (req.query.read === 'false') rd = false;
    else {
      return res.status(401).json({ error: 'invalid read condition' });
    }
    where.read = {
      [Op.eq]: rd,
    };
  }
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['passwordHash'] },
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        through: { attributes: ['id', 'read'], as: 'readinglists', where },
      },
    ],
  });
  res.json(user);
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
