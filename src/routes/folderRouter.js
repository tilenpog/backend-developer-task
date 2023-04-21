const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const ApiResponses = require("../utils/apiResponses");
const { RequireAuth } = require("../middleware/authorization");
const { getAllFolders, getFolder, createFolder, updateFolder, deleteFolder, deleteAllFolders } = require("../controllers/folderController");
const { getNotesInFolder } = require("../controllers/noteController");

router.get("/", RequireAuth, asyncHandler(async (req, res) => {
    const userId = req.authInfo.user.id;

    const folders = await getAllFolders(userId);

    return ApiResponses.SUCCESS(res, folders);
  })
);

router.get("/:id", RequireAuth, asyncHandler(async (req, res) => {
  const userId = req.authInfo.user.id;
  const folderId = req.params.id;

  const folder = await getFolder(folderId, userId);

  if (!folder) return ApiResponses.NOT_FOUND(res);
  return ApiResponses.SUCCESS(res, folder);
}));

router.get("/:id/notes", RequireAuth, asyncHandler(async (req, res) => {
  const userId = req.authInfo.user.id;
  const folderId = req.params.id;

  const notes = await getNotesInFolder(folderId, userId);
  return ApiResponses.SUCCESS(res, notes);
}));

router.post("/", RequireAuth, asyncHandler(async (req, res) => {
  const createData = req.body;
  createData.UserId = req.authInfo.user.id;
  //TODO: validate createData

  const folder = await createFolder(createData);

  return ApiResponses.CREATED(res, folder);
}));

router.put("/:id", RequireAuth, asyncHandler(async (req, res) => {
  const userId = req.authInfo.user.id;
  const folderId = req.params.id;
  const updateData = req.body;

  //TODO: validate updateData
  const [changedRows] = await updateFolder(folderId, updateData, userId);

  if (changedRows === 0) return ApiResponses.INTERNAL_SERVER_ERROR(res);
  return ApiResponses.NO_CONTENT(res);
}));

router.delete("/:id", RequireAuth, asyncHandler(async (req, res) => {
  const userId = req.authInfo.user.id;
  const folderId = req.params.id;

  await deleteFolder(folderId, userId);
  
  return ApiResponses.NO_CONTENT(res);
}));

router.delete("/", RequireAuth, asyncHandler(async (req, res) => {
  const userId = req.authInfo.user.id;
  await deleteAllFolders(userId);

  return ApiResponses.NO_CONTENT(res);
}));

module.exports = router;