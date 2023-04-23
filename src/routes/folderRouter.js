const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const ApiResponses = require("../utils/apiResponses");
const { RequireAuth } = require("../middleware/authorization");
const FolderController = require("../controllers/folderController");
const Validators = require("../utils/validators");

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
  Validators.ValidateIdQueryParam,
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
  Validators.ValidateCreateFolderData,
  asyncHandler(async (req, res) => {
    const createData = req.body;
    createData.UserId = req.authInfo.user.id;

    const folder = await FolderController.createFolder(createData);

    return ApiResponses.CREATED(res, folder);
  })
);

router.put(
  "/:id",
  RequireAuth,
  Validators.ValidateIdQueryParam,
  Validators.ValidateUpdateFolderData,
  asyncHandler(async (req, res) => {
    const userId = req.authInfo.user.id;
    const folderId = req.params.id;
    const updateData = req.body;

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
  Validators.ValidateIdQueryParam,
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
