const router = require('express').Router();
const { tokenExtractor } = require('../util/middleware');
const { Sessions } = require('../models');

router.delete('/', tokenExtractor, async (req, res) => {
  await Sessions.destroy({
    where: {
      user_id: req.decodedToken.id,
    },
  });
  res.status(204).end();
});

module.exports = router;
