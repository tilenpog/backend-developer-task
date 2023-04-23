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
  asyncHandler(async (req, res) => {
    const userId = req.authInfo.user.id;
    const folderId = req.params.id;

    const {isValid, error} = Validators.isFolderIdValid(folderId);
    if (!isValid) {
      return ApiResponses.BAD_REQUEST(res, error);
    }

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

    const {isValid, error} = Validators.isCreateFolderDataValid(createData); //TODO add test
    if (!isValid) {
      return ApiResponses.BAD_REQUEST(res, error);
    }

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

    let validCheck = Validators.isFolderIdValid(folderId);
    if (!validCheck.isValid) {
      return ApiResponses.BAD_REQUEST(res, validCheck.error);
    }

    validCheck = Validators.isUpdateFolderDataValid(updateData);
    if (!validCheck.isValid) {
      return ApiResponses.BAD_REQUEST(res, validCheck.error);
    }

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

    let validCheck = Validators.isFolderIdValid(folderId); //TODO add test
    if (!validCheck.isValid) {
      return ApiResponses.BAD_REQUEST(res, validCheck.error);
    }

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
