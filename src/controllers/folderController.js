const { Folder } = require('../models/model');

const getAllFolders = (userId) => {
    return Folder.findAll({ where: { UserId: userId } });
};

const getFolder = (folderId, userId) => {
    return Folder.findOne({ where: { id: folderId, UserId: userId } });
};

const createFolder = (createData, userId) => {
    return Folder.create({ ...createData, UserId: userId });
};

const updateFolder = (folderId, data, userId) => {
    return Folder.update(data, { where: { id: folderId, UserId: userId } });
};

const deleteFolder = (folderId, userId) => {
    return Folder.destroy({ where: { id: folderId, UserId: userId } });
};

const deleteAllFolders = (userId) => {
    return Folder.destroy({ where: { UserId: userId } });
};

module.exports = {
    getAllFolders,
    getFolder,
    createFolder,
    updateFolder,
    deleteFolder,
    deleteAllFolders
};