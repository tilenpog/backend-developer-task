const { User } = require('../models/model');

const getAllUsers = async () => {
    return User.findAll();
};

const getUserByUsername = async (username) => {
    return User.findOne({ where: { username } });
};

module.exports = {
    getAllUsers,
    getUserByUsername
};