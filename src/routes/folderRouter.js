const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const { RequireAuth } = require("../middleware/authorization");
const { getAllFolders, getFolder, createFolder, updateFolder, deleteFolder, deleteAllFolders } = require("../controllers/folderController");

router.get("/", RequireAuth, asyncHandler(async (req, res) => {
    const userId = req.authInfo.user.id;

    const folders = await getAllFolders(userId);

    res.json(folders);
  })
);

router.get("/:id", RequireAuth, asyncHandler(async (req, res) => {
  const userId = req.authInfo.user.id;
  const folderId = req.params.id;

  const folder = await getFolder(folderId, userId);

  if (!folder) return res.status(404).json({ message: "Folder not found!" });
  res.json(folder);
}));

router.post("/", RequireAuth, asyncHandler(async (req, res) => {
  const userId = req.authInfo.user.id;
  const createData = req.body;
  //TODO: validate createData
  const folder = await createFolder(createData, userId);

  res.status(201).json(folder);
}));

router.put("/:id", RequireAuth, asyncHandler(async (req, res) => {
  const userId = req.authInfo.user.id;
  const folderId = req.params.id;
  const updateData = req.body;
  //TODO: validate updateData
  const [changedRows] = await updateFolder(folderId, updateData, userId);

  if (changedRows === 0) return res.status(400).json({ message: "Folder update failed!" });

  res.status(200).json({ message: "Folder updated successfully!" });
}));

router.delete("/:id", RequireAuth, asyncHandler(async (req, res) => {
  const userId = req.authInfo.user.id;
  const folderId = req.params.id;
  await deleteFolder(folderId, userId);
  res.status(200).send();
}));

router.delete("/", RequireAuth, asyncHandler(async (req, res) => {
  const userId = req.authInfo.user.id;
  await deleteAllFolders(userId);
  res.status(200).send();
}));

module.exports = router;