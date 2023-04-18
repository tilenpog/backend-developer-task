const { Folder } = require('../models/model');

const getAllFolders = async () => {
    return Folder.findAll();
};

module.exports = {
    getAllFolders,
};