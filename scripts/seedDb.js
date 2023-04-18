const { User, Folder, Note, NoteItem } = require('../src/models/model');

seedDb();

async function seedDb() {
    console.log('Seeding database...');
    await User.sync({ force: true });
    await Folder.sync({ force: true });
    await Note.sync({ force: true });
    await NoteItem.sync({ force: true });    

    await Promise.all([createUsers(), createFolders(), createNotes(), createNoteItems()]);

    console.log('Database seeded!');
}

createUsers = () => {
    return User.bulkCreate([
        { name: 'admin', username: 'admin', password: 'admin' },
        { name: 'Jane', username: 'user', password: 'user' },
        { name: 'John', username: 'john1990', password: 'verySecure' },
        { name: 'John', username: 'emptyFolders', password: 'password' },
    ]);
}

createFolders = () => {
    return Folder.bulkCreate([
        { name: 'Folder 1', UserId: 1 },
        { name: 'Folder 2', UserId: 1 },
        { name: 'Folder 3', UserId: 1 },
        { name: 'Folder 4', UserId: 2 },
        { name: 'Folder 5', UserId: 2 },
    ]);
}

createNotes = () => {
    return Note.bulkCreate([
        { name: 'Note 1', type: 'list', body: 'This is a list note', visibility: 'public', FolderId: 1 },
        { name: 'Note 2', type: 'text', body: 'This is a note', visibility: 'public', FolderId: 1 },
        { name: 'Note 2', type: 'text', body: 'This is a private note', visibility: 'private', FolderId: 1 },
    ]);
}

createNoteItems = () => {
    return NoteItem.bulkCreate([
        { body: 'This is a note item', NoteId: 1 },
        { body: 'This is a note item', NoteId: 1 },
    ]);
}