const router = require("express").Router();
const asyncHandler = require("express-async-handler");

const { getAllFolders } = require("../controllers/folderController");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    //TODO: only return folders for the current user
    const folders = await getAllFolders();
    res.json(folders);
  })
);

module.exports = router;