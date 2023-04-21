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
    visibility: {
      type: Sequelize.ENUM("public", "private"), //TODO create an actual enum
      defaultValue: "private",
    },
  },
  {
    sequelize,
    modelName: "Note",
    scopes: {
      canView(userId) {
        return {
          include: { model: Folder },
          where: {
            [Sequelize.Op.or]: [
              { visibility: "public" },
              { "$Folder.UserId$": userId },
            ],
          },
        };
      },
    },
  }
);

class NoteListItem extends Sequelize.Model {}
NoteListItem.init(
  {
    body: {
      type: Sequelize.TEXT,
      defaultValue: "",
    },
  },
  {
    sequelize,
    modelName: "NoteListItem",
  }
);

class NoteTextItem extends Sequelize.Model {}
NoteTextItem.init(
  {
    body: {
      type: Sequelize.TEXT,
      defaultValue: "",
    },
  },
  {
    sequelize,
    modelName: "NoteTextItem",
  }
);

//Define relationships between models
User.hasMany(Folder, { onDelete: "cascade" });
Folder.belongsTo(User);

Folder.hasMany(Note, { onDelete: "cascade" });
Note.belongsTo(Folder);

Note.hasMany(NoteListItem, { onDelete: "cascade" });
NoteListItem.belongsTo(Note);

Note.hasOne(NoteTextItem, { onDelete: "cascade" });
NoteTextItem.belongsTo(Note);

// Note.addScope("canView", {
//   include: {
//     model: Folder,
//     where: { UserId: Sequelize.col("Note.UserId") },
//   },
//   where: {
//     [Sequelize.Op.or]: [
//       { visibility: "public" },
//       { "$Folder.UserId$": Sequelize.col("userId") },
//     ],
//   },
// });

module.exports = {
  User,
  Folder,
  Note,
  NoteListItem,
  NoteTextItem,
};
