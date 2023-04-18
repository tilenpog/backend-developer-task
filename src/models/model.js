const Sequelize = require("sequelize");
const { sequelize } = require("../database");

class User extends Sequelize.Model {}
User.init(
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      //TODO: add unique constraint
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

class Folder extends Sequelize.Model {}
Folder.init(
  {
    name: {
      type: Sequelize.STRING,
      defaultValue: "Unnamed folder",
    },
  },
  {
    sequelize,
    modelName: "Folder",
  }
);

class Note extends Sequelize.Model {}
Note.init(
  {
    name: {
      type: Sequelize.STRING,
      defaultValue: "Unnamed note",
    },
    type: {
      type: Sequelize.ENUM("text", "list"), //TODO create an actual enum
      defaultValue: "text",
    },
    body: {
      type: Sequelize.TEXT,
      defaultValue: "",
    },
    visibility: {
      type: Sequelize.ENUM("public", "private"), //TODO create an actual enum
      defaultValue: "private",
    },
  },
  {
    sequelize,
    modelName: "Note",
  }
);

class NoteItem extends Sequelize.Model {}
NoteItem.init(
  {
    body: {
      type: Sequelize.TEXT,
      defaultValue: "",
    },
  },
  {
    sequelize,
    modelName: "NoteItem",
  }
);

//Define relationships between models
User.hasMany(Folder);
Folder.belongsTo(User);

Folder.hasMany(Note);
Note.belongsTo(Folder);

Note.hasMany(NoteItem);
NoteItem.belongsTo(Note);

module.exports = {
  User,
  Folder,
  Note,
  NoteItem,
};