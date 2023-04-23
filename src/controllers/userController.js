const { User } = require("../models/model");

const getUserByUsername = async (username) => {
  return User.findOne({ where: { username } });
};

module.exports = {
  getUserByUsername,
};
