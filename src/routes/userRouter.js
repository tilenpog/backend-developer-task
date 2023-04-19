const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const { getAllUsers } = require("../controllers/usercontroller");

router.get("/", asyncHandler(async (req, res) => {
    const users = await getAllUsers();
    res.json(users);
  })
);

module.exports = router;