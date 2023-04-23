const ApiResponses = require("./apiResponses");

const ValidateCreateFolderData = (req, res, next) => {
  const folderData = req.body;
  if (!folderData || typeof folderData !== "object") {
    return ApiResponses.BAD_REQUEST(res, "Folder data is missing or invalid.");
  }
  if (!("name" in folderData)) {
    return ApiResponses.BAD_REQUEST(res, "Folder name is missing.");
  }
  const name = folderData.name.trim();
  if (!name) {
    return ApiResponses.BAD_REQUEST(res, "Folder name cannot be empty.");
  }

  return next();
};

const ValidateUpdateFolderData = (req, res, next) => {
  const folderData = req.body;
  if (!folderData || typeof folderData !== "object") {
    return ApiResponses.BAD_REQUEST(res, "Folder data is missing or invalid.");
  }
  if ("name" in folderData) {
    const name = folderData.name.trim();
    if (!name) {
      return ApiResponses.BAD_REQUEST(res, "Folder name cannot be empty.");
    }
  }

  return next();
};

const ValidateIdQueryParam = (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return ApiResponses.BAD_REQUEST(res, "Folder id is missing.");
  }
  if (isNaN(Number(id))) {
    return ApiResponses.BAD_REQUEST(res, "Folder id must be a number.");
  }
  return next();
};

const ValidateCreateNoteData = (req, res, next) => {
  const noteData = req.body;
  if (!noteData || typeof noteData !== "object") {
    return ApiResponses.BAD_REQUEST(res, "Note data is missing or invalid.");
  }
  if (!("name" in noteData)) {
    return ApiResponses.BAD_REQUEST(res, "Note name is missing.");
  }
  const name = noteData.name.trim();
  if (!name) {
    return ApiResponses.BAD_REQUEST(res, "Note name cannot be empty.");
  }
  if (!("type" in noteData)) {
    return ApiResponses.BAD_REQUEST(res, "Note type is missing.");
  }
  const type = noteData.type.trim().toLowerCase();
  if (type !== "list" && type !== "text") {
    return ApiResponses.BAD_REQUEST(res, "Note type must be 'list' or 'text'.");
  }
  if (!("visibility" in noteData)) {
    return ApiResponses.BAD_REQUEST(res, "Note visibility is missing.");
  }
  const visibility = noteData.visibility.trim().toLowerCase();
  if (visibility !== "public" && visibility !== "private") {
    return ApiResponses.BAD_REQUEST(
      res,
      "Note visibility must be 'public' or 'private'."
    );
  }
  if (!("folderId" in noteData)) {
    return ApiResponses.BAD_REQUEST(res, "Note folder ID is missing.");
  }
  const folderId = Number(noteData.folderId);
  if (!Number.isInteger(folderId)) {
    return ApiResponses.BAD_REQUEST(res, "Note folder ID must be an integer.");
  }
  if (!("items" in noteData) || !Array.isArray(noteData.items)) {
    return ApiResponses.BAD_REQUEST(res, "Note items must be an array.");
  }
  for (const item of noteData.items) {
    if (
      typeof item !== "object" ||
      !("body" in item) ||
      typeof item.body !== "string"
    ) {
      return ApiResponses.BAD_REQUEST(res, "Invalid note item format.");
    }
  }

  return next();
};

const ValidateUpdateNoteData = (req, res, next) => {
  const noteData = req.body;
  if (!noteData || typeof noteData !== "object") {
    return ApiResponses.BAD_REQUEST(res, "Note data is missing or invalid.");
  }

  if ("name" in noteData) {
    const name = noteData.name.trim();
    if (!name) {
      return ApiResponses.BAD_REQUEST(res, "Note name cannot be empty.");
    }
  }

  if ("type" in noteData) {
    const type = noteData.type.trim().toLowerCase();
    if (type !== "list" && type !== "text") {
      return ApiResponses.BAD_REQUEST(
        res,
        "Note type must be 'list' or 'text'."
      );
    }
  }

  if ("visibility" in noteData) {
    const visibility = noteData.visibility.trim().toLowerCase();
    if (visibility !== "public" && visibility !== "private") {
      return ApiResponses.BAD_REQUEST(
        res,
        "Note visibility must be 'public' or 'private'."
      );
    }
  }

  if ("folderId" in noteData) {
    const folderId = Number(noteData.folderId);
    if (!Number.isInteger(folderId)) {
      return ApiResponses.BAD_REQUEST(
        res,
        "Note folder ID must be an integer."
      );
    }
  }

  if ("items" in noteData) {
    if (!Array.isArray(noteData.items)) {
      return ApiResponses.BAD_REQUEST(res, "Note items must be an array.");
    }
    for (const item of noteData.items) {
      if (
        typeof item !== "object" ||
        !("body" in item) ||
        typeof item.body !== "string"
      ) {
        return ApiResponses.BAD_REQUEST(res, "Invalid note item format.");
      }
    }
  }

  return next();
};

module.exports = {
  ValidateCreateFolderData,
  ValidateUpdateFolderData,
  ValidateIdQueryParam,
  ValidateCreateNoteData,
  ValidateUpdateNoteData,
};
