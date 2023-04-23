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
  if ("name" in folderData) {
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

const isNoteIdValid = (noteId) => {
  if (!noteId) {
    return validationError("Note id is missing.");
  }
  if (isNaN(Number(noteId))) {
    return validationError("Note id must be a number.");
  }
  return validationSuccess();
};

const isCreateNoteDataValid = (noteData) => {
  if (!noteData || typeof noteData !== "object") {
    return validationError("Note data is missing or invalid.");
  }
  if (!("name" in noteData)) {
    return validationError("Note name is missing.");
  }
  const name = noteData.name.trim();
  if (!name) {
    return validationError("Note name cannot be empty.");
  }
  if (!("type" in noteData)) {
    return validationError("Note type is missing.");
  }
  const type = noteData.type.trim().toLowerCase();
  if (type !== "list" && type !== "text") {
    return validationError("Note type must be 'list' or 'text'.");
  }
  if (!("visibility" in noteData)) {
    return validationError("Note visibility is missing.");
  }
  const visibility = noteData.visibility.trim().toLowerCase();
  if (visibility !== "public" && visibility !== "private") {
    return validationError("Note visibility must be 'public' or 'private'.");
  }
  if (!("folderId" in noteData)) {
    return validationError("Note folder ID is missing.");
  }
  const folderId = Number(noteData.folderId);
  if (!Number.isInteger(folderId)) {
    return validationError("Note folder ID must be an integer.");
  }
  if (!("items" in noteData) || !Array.isArray(noteData.items)) {
    return validationError("Note items must be an array.");
  }
  for (const item of noteData.items) {
    if (
      typeof item !== "object" ||
      !("body" in item) ||
      typeof item.body !== "string"
    ) {
      return validationError("Invalid note item format.");
    }
  }

  return validationSuccess();
};

const isUpdateNoteDataValid = (noteData) => {
  if (!noteData || typeof noteData !== "object") {
    return validationError("Note data is missing or invalid.");
  }
  
  if ("name" in noteData) {
    const name = noteData.name.trim();
    if (!name) {
      return validationError("Note name cannot be empty.");
    }
  }

  if ("type" in noteData) {
    const type = noteData.type.trim().toLowerCase();
    if (type !== "list" && type !== "text") {
      return validationError("Note type must be 'list' or 'text'.");
    }
  }

  if ("visibility" in noteData) {
    const visibility = noteData.visibility.trim().toLowerCase();
    if (visibility !== "public" && visibility !== "private") {
      return validationError("Note visibility must be 'public' or 'private'.");
    }
  }

  if ("folderId" in noteData) {
    const folderId = Number(noteData.folderId);
    if (!Number.isInteger(folderId)) {
      return validationError("Note folder ID must be an integer.");
    }
  }

  if ("items" in noteData) {
    if (!Array.isArray(noteData.items)) {
      return validationError("Note items must be an array.");
    }
    for (const item of noteData.items) {
      if (
        typeof item !== "object" ||
        !("body" in item) ||
        typeof item.body !== "string"
      ) {
        return validationError("Invalid note item format.");
      }
    }
  }

  return validationSuccess();
};

const validationError = (message) => {
  return { isValid: false, error: message };
};

const validationSuccess = () => {
  return { isValid: true, error: "" };
};

module.exports = {
  isCreateFolderDataValid,
  isUpdateFolderDataValid,
  isFolderIdValid,
  isNoteIdValid,
  isCreateNoteDataValid,
  isUpdateNoteDataValid
};
