const express = require("express");
const { getAllUsers, deleteUser, updateUser } = require("../controllers/userController.js");

const router = express.Router();

// GET all users
router.get("/", getAllUsers);

// DELETE user
router.delete("/:id", deleteUser);

// UPDATE user
router.put("/:id", updateUser);

module.exports = router;
