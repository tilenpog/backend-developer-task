const router = require("express").Router();
const asyncHandler = require("express-async-handler");

const { getAllFolders } = require("../controllers/folderController");

router.get("/", asyncHandler(async (req, res) => {
    //TODO: only return notes for the current user and public notes
    const folders = await getAllNotes();
    res.json(notes);
  })
);

//TODO - add routes for:
//Get a note by id (including note items)
//Get all notes
//Get all notes for a folder
//Get all notes belonging to a user
  //Return all public and all private belonging to user

//Create a note
//Update a note
//Delete a note

//Edit note items - think about how to do this

//Implement pagination, sorting, filtering

module.exports = router;