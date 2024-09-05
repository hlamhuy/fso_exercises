const Blog = require('./blog');
const User = require('./user');
const ReadingLists = require('./readingLists');

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingLists, as: 'readings' });
Blog.belongsToMany(User, { through: ReadingLists, as: 'readinglists' });
//Blog.sync({ alter: true });
//User.sync({ alter: true });

module.exports = {
  Blog,
  User,
  ReadingLists,
};
