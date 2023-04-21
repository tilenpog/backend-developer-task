const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const ApiResponses = require("../utils/apiResponses");
const { RequireAuth } = require("../middleware/authorization");
const FolderController = require("../controllers/folderController");
const { getNotesInFolder } = require("../controllers/noteController");

router.get(
  "/",
  RequireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.authInfo.user.id;

    const folders = await FolderController.getAllFolders(userId);

    return ApiResponses.SUCCESS(res, folders);
  })
);

router.get(
  "/:id",
  RequireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.authInfo.user.id;
    const folderId = req.params.id;

    const folder = await FolderController.getFolder(folderId, userId);

    if (!folder) return ApiResponses.NOT_FOUND(res);
    return ApiResponses.SUCCESS(res, folder);
  })
);

router.post(
  "/",
  RequireAuth,
  asyncHandler(async (req, res) => {
    const createData = req.body;
    createData.UserId = req.authInfo.user.id;
    //TODO: validate createData

    const folder = await FolderController.createFolder(createData);

    return ApiResponses.CREATED(res, folder);
  })
);

router.put(
  "/:id",
  RequireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.authInfo.user.id;
    const folderId = req.params.id;
    const updateData = req.body;
    //TODO: validate updateData

    const [changedRows] = await FolderController.updateFolder(
      folderId,
      updateData,
      userId
    );

    if (changedRows === 0) return ApiResponses.BAD_REQUEST(res);
    return ApiResponses.NO_CONTENT(res);
  })
);

router.delete(
  "/:id",
  RequireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.authInfo.user.id;
    const folderId = req.params.id;

    await FolderController.deleteFolder(folderId, userId);

    return ApiResponses.NO_CONTENT(res);
  })
);

router.delete(
  "/",
  RequireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.authInfo.user.id;
    await FolderController.deleteAllFolders(userId);

    return ApiResponses.NO_CONTENT(res);
  })
);

module.exports = router;
