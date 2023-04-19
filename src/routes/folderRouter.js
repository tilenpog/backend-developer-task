const router = require("express").Router();
const asyncHandler = require("express-async-handler");

const { getAllFolders } = require("../controllers/folderController");

router.get("/", asyncHandler(async (req, res) => {
    //TODO: only return folders for the current user
    const folders = await getAllFolders();
    res.json(folders);
  })
);



//TODO - add routes for:
//Get a folder by id (including notes)
//Get all folders for a user
//Create a folder
//Update a folder
//Delete a folder

module.exports = router;