const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');
const { Sessions } = require('../models');

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    try {
      const decodedToken = jwt.verify(token, SECRET);
      const activeSession = await Sessions.findOne({
        where: {
          token: token,
        },
      });
      if (!activeSession) {
        return res.status(401).json({ error: 'active session not found' });
      }
      req.decodedToken = decodedToken;
    } catch {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};

module.exports = { tokenExtractor };
