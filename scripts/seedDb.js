const bcrypt = require("bcrypt");
const {
  User,
  Folder,
  Note,
  NoteListItem,
  NoteTextItem,
} = require("../src/models/model");

// seedDb(true);

async function seedDb(loggingEnabled = false) {
  if (loggingEnabled) console.log("Started seeding database.");
  await User.sync({ force: true });
  await Folder.sync({ force: true });
  await Note.sync({ force: true });
  await NoteListItem.sync({ force: true });
  await NoteTextItem.sync({ force: true });

  await Promise.all([
    createUsers(),
    createFolders(),
    createNotes(),
    createNoteListItems(),
    createNoteTextItems(),
  ]);

  if (loggingEnabled) console.log("Database seeded!");
}

createUsers = () => {
  return User.bulkCreate([
    { name: "admin", username: "admin", password: hashPassword("admin") },
    { name: "Jane", username: "user", password: hashPassword("user") },
  ]);
};

hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

createFolders = () => {
  return Folder.bulkCreate([
    { name: "Folder 1", UserId: 1 },
    { name: "Folder 2", UserId: 1 },
    { name: "Folder 3", UserId: 1 },
    { name: "Folder 4", UserId: 2 },
    { name: "Folder 5", UserId: 2 },
  ]);
};

createNotes = () => {
  return Note.bulkCreate([
    { name: "Note 1", type: "list", visibility: "public", FolderId: 1 },
    { name: "Note 2", type: "text", visibility: "public", FolderId: 1 },
    { name: "Note 3", type: "text", visibility: "private", FolderId: 1 },
    { name: "Note 4", type: "text", visibility: "private", FolderId: 4 },
  ]);
};

createNoteListItems = () => {
  return NoteListItem.bulkCreate([
    { body: "This is a note list item", NoteId: 1 },
    { body: "This is another note list item", NoteId: 1 },
  ]);
};

createNoteTextItems = () => {
  return NoteTextItem.bulkCreate([
    { body: "This is a note text item", NoteId: 2 },
    { body: "I am a text note!", NoteId: 3 },
  ]);
};

module.exports = { seedDb };
