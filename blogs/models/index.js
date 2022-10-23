const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./readingList");
const Session = require("./session");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: "blogs_read" });
Blog.belongsToMany(User, { through: ReadingList, as: "users_read" });

module.exports = {
  Blog,
  User,
  ReadingList,
  Session,
};
