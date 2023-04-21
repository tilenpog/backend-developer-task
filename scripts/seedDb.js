const bcrypt = require("bcrypt")
const { User, Folder, Note, NoteListItem, NoteTextItem } = require('../src/models/model');

seedDb();

async function seedDb() {
    console.log('Started seeding database.');
    await User.sync({ force: true });
    await Folder.sync({ force: true });
    await Note.sync({ force: true });
    await NoteListItem.sync({ force: true });    
    await NoteTextItem.sync({ force: true });    

    await Promise.all([createUsers(), createFolders(), createNotes(), createNoteListItems(), createNoteTextItems()]);

    console.log('Database seeded!');
}

createUsers = () => {
    console.log('Creating users...');
    return User.bulkCreate([
        { name: 'admin', username: 'admin', password: hashPassword('admin') },
        { name: 'Jane', username: 'user', password: hashPassword('user') },
        { name: 'John', username: 'john1990', password: hashPassword('verySecure')},
        { name: 'Michael', username: 'emptyFolders', password: hashPassword('password') },
        { name: 'Alice', username: 'noFolders', password: hashPassword('password') },
    ]);
}

hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
}

createFolders = () => {
    console.log('Creating folders...');
    return Folder.bulkCreate([
        { name: 'Folder 1', UserId: 1 },
        { name: 'Folder 2', UserId: 1 },
        { name: 'Folder 3', UserId: 1 },
        { name: 'Folder 4', UserId: 2 },
        { name: 'Folder 5', UserId: 2 },
    ]);
}

createNotes = () => {
    console.log('Creating notes...');
    return Note.bulkCreate([
        { name: 'Note 1', type: 'list', visibility: 'public', FolderId: 1 },
        { name: 'Note 2', type: 'text', visibility: 'public', FolderId: 1 },
        { name: 'Note 2', type: 'text', visibility: 'private', FolderId: 1 },
    ]);
}

createNoteListItems = () => {
    console.log('Creating note list items...');
    return NoteListItem.bulkCreate([
        { body: 'This is a note list item', NoteId: 1 },
        { body: 'This is another note list item', NoteId: 1 },
    ]);
}

createNoteTextItems = () => {
    console.log('Creating note list items...');
    return NoteTextItem.bulkCreate([
        { body: 'This is a note text item', NoteId: 2 },
        { body: 'I am a text note!', NoteId: 3 },
    ]);
}