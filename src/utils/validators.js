
const isCreateFolderDataValid = (folderData) => {
    if (!folderData || typeof folderData !== "object") {
        return validationError("Folder data is missing or invalid.");
    }
    if (!("name" in folderData)) {
        return validationError("Folder name is missing.");
    }
    const name = folderData.name.trim();
    if (!name) {
        return validationError("Folder name cannot be empty.");
    }
    
    return validationSuccess();
};

const isUpdateFolderDataValid = (folderData) => {
    if (!folderData || typeof folderData !== "object") {
        return validationError("Folder data is missing or invalid.");
    }
    if (("name" in folderData)) {
        const name = folderData.name.trim();
        if (!name) {
            return validationError("Folder name cannot be empty.");
        }
    }
    
    return validationSuccess();
};

const isFolderIdValid = (folderId) => {
    if (!folderId) {
        return validationError("Folder id is missing.");
    }
    if (isNaN(Number(folderId))) {
        return validationError("Folder id must be a number.");
    }
    return validationSuccess();
};


const isCreateNoteDataValid = (data) => {
   //todo
};

const validationError = (message) => {
    return {isValid: false, error: message};
};

const validationSuccess = () => {
    return {isValid: true, error: ''};
};

module.exports = {
    isCreateFolderDataValid,
    isUpdateFolderDataValid,
    isFolderIdValid,
    isCreateNoteDataValid,
}