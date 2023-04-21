const { Note, Folder, NoteListItem, NoteTextItem } = require("../models/model");

const getNotes = (userId) => {
  return Note.scope({ method: ["canView", userId] }).findAll({
    include: [NoteListItem, NoteTextItem],
  });
};

const getNoteById = (userId, noteId) => {
  return Note.scope({ method: ["canView", userId] }).findByPk(noteId, {
    include: [NoteListItem, NoteTextItem],
  });
};

const createNote = async (createNoteData) => {
  const newNote = await sequelize.transaction(async (t) => {
    const { name, type, visibility, folderId, items } = createNoteData;
    const newNote = await Note.create(
      { name, type, visibility, FolderId: folderId },
      { transaction: t }
    );
    await createNoteItems(newNote.id, items, type, t);

    return newNote;
  });

  return newNote.id;
};

const createNoteItems = async (noteId, items, type, transaction) => {
  if (items.length === 0) {
    return;
  }

  const noteItems = items.map((item) => ({ ...item, NoteId: noteId }));

  switch (type) {
    case "list":
      await NoteListItem.bulkCreate(noteItems, { transaction: transaction });
      break;
    case "text":
      await NoteTextItem.create(noteItems[0], { transaction: transaction });
      break;
    default:
      throw new Error("Invalid note type" + type);
  }
};

const updateNote = async (noteId, data, userId) => {
  const note = await Note.findOne({
    where: { id: noteId },
    include: [Folder, NoteListItem, NoteTextItem],
  });

  if (!note || note.Folder.UserId !== userId) {
    return false;
  }
  //TODO: check if folder is okay, owned by user
  const { items, ...noteData } = data;

  await note.update(noteData);

  if (note.type === "list") {
    await NoteListItem.destroy({ where: { NoteId: noteId } });
    if (items) {
      await Promise.all(
        items.map(async (item) => {
          await NoteListItem.create({ body: item.body, NoteId: noteId });
        })
      );
    }
  } else if (note.type === "text") {
    await NoteTextItem.destroy({ where: { NoteId: noteId } });
    if (items) {
      await Promise.all(
        items.map(async (item) => {
          await NoteTextItem.create({ body: item.body, NoteId: noteId });
        })
      );
    }
  }

  return true;
};

const deleteNote = (noteId, userId) => {
  return sequelize.transaction(async (t) => {
    const note = await Note.findByPk(noteId, {
      include: Folder,
      transaction: t,
    });

    if (!note || note.Folder.UserId !== userId) {
      return;
    }

    await note.destroy({ transaction: t });
  });
};

const deleteAllNotes = (userId) => {
  return sequelize.transaction(async (t) => {
    const userFolders = await Folder.findAll({
      where: { UserId: userId },
      transaction: t,
    });
    const folderIds = userFolders.map((folder) => folder.id);

    await Note.destroy({ where: { FolderId: folderIds }, transaction: t });
  });
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  deleteAllNotes,
};
