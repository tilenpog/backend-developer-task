const { Folder } = require('../models/model');

const getAllFolders = (userId) => {
    return Folder.findAll({ where: { UserId: userId } });
};

const getFolder = (folderId, userId) => {
    return Folder.findOne({ where: { id: folderId, UserId: userId } });
};

const createFolder = (createData) => {
    return Folder.create(createData);
};

const updateFolder = (folderId, data, userId) => {
    return Folder.update(data, { where: { id: folderId, UserId: userId } });
};

const deleteFolder = (folderId, userId) => {
    //TODO: should also delete notes in folder
    return Folder.destroy({ where: { id: folderId, UserId: userId } });
};

const deleteAllFolders = (userId) => {
    //TODO: should also delete notes in folder
    return Folder.destroy({ where: { UserId: userId } });
};

const userOwnsFolder =  async (userId, folderId) => {
    const folder = await Folder.findOne({ where: { id: folderId, UserId: userId } });
    return folder !== null;
};

module.exports = {
    getAllFolders,
    getFolder,
    createFolder,
    updateFolder,
    deleteFolder,
    deleteAllFolders,
    userOwnsFolder
};