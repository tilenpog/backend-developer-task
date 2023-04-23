const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const { OptionalAuth, RequireAuth } = require("../middleware/authorization");
const ApiResponses = require("../utils/apiResponses");
const Validators = require("../utils/validators");

const NoteController = require("../controllers/noteController");
const FolderController = require("../controllers/folderController");

router.get(
  "/",
  OptionalAuth,
  asyncHandler(async (req, res) => {
    const userId = req.authInfo.isAuthorized ? req.authInfo.user.id : -1;

    const paginationData = {
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10,
    };

    const orderData = { sort: "id", order: "ASC" };
    const supportedSortBy = [
      "id",
      "name",
      "visibility",
      "updatedAt",
      "createdAt",
    ];
    const supportedOrderBy = ["ASC", "DESC", "asc", "desc"];
    if (req.query.sort) {
      if (!supportedSortBy.includes(req.query.sort)) {
        return ApiResponses.BAD_REQUEST(res, "Invalid sortBy value");
      }
      orderData.sort = req.query.sort;
    }
    if (req.query.order) {
      if (!supportedOrderBy.includes(req.query.order)) {
        return ApiResponses.BAD_REQUEST(res, "Invalid orderBy value");
      }
      orderData.order = req.query.order.toUpperCase();
    }

    const result = await NoteController.getNotes(
      userId,
      paginationData,
      orderData
    );
    return ApiResponses.SUCCESS(res, result);
  })
);

router.get(
  "/:id",
  OptionalAuth,
  Validators.ValidateIdQueryParam,
  asyncHandler(async (req, res) => {
    const userId = req.authInfo.isAuthorized ? req.authInfo.user.id : -1;
    const noteId = req.params.id;

    const note = await NoteController.getNoteById(userId, noteId);

    if (!note) {
      return ApiResponses.NOT_FOUND(res);
    }

    return ApiResponses.SUCCESS(res, note);
  })
);

router.post(
  "/",
  RequireAuth,
  Validators.ValidateCreateNoteData,
  asyncHandler(async (req, res) => {
    const createNoteData = req.body;
    const userId = req.authInfo.user.id;

    const userOwnsFolder = await FolderController.userOwnsFolder(
      userId,
      createNoteData.folderId
    );
    if (!userOwnsFolder) {
      return ApiResponses.FORBIDDEN(res);
    }

    const newNote = await NoteController.createNote(createNoteData);

    return ApiResponses.CREATED(res, newNote);
  })
);

router.put(
  "/:id",
  RequireAuth,
  Validators.ValidateIdQueryParam,
  Validators.ValidateUpdateNoteData,
  asyncHandler(async (req, res) => {
    const noteId = req.params.id;
    const userId = req.authInfo.user.id;
    const updateNoteData = req.body;

    const succeeded = await NoteController.updateNote(
      noteId,
      updateNoteData,
      userId
    );

    if (!succeeded) return ApiResponses.INTERNAL_SERVER_ERROR(res);
    return ApiResponses.NO_CONTENT(res);
  })
);

router.delete(
  "/:id",
  RequireAuth,
  Validators.ValidateIdQueryParam,
  asyncHandler(async (req, res) => {
    const noteId = req.params.id;
    const userId = req.authInfo.user.id;

    await NoteController.deleteNote(noteId, userId);

    return ApiResponses.NO_CONTENT(res);
  })
);

router.delete(
  "/",
  RequireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.authInfo.user.id;

    await NoteController.deleteAllNotes(userId);

    return ApiResponses.NO_CONTENT(res);
  })
);

module.exports = router;
