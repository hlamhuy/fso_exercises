const router = require('express').Router();
const { ReadingLists } = require('../models');

router.post('/', async (req, res) => {
  const list = ReadingLists.create(req.body);
  res.json(list);
});

module.exports = router;
