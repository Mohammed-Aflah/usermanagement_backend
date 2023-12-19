const express = require("express");
const { upload } = require("../storage/profilestorage");
const {
  adminLogin,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  checkAdminAuth,
  adminLogout
} = require("../controller/adminController");
const router = express.Router();

router.post("/login", adminLogin);
router.get("/getallusers", getAllUsers);
router.post("/createuser", upload.single("profile"), createUser);
router.put("/updateuser/:id", upload.single("profile"), updateUser);
router.delete("/deleteuser/:id", deleteUser);
router.get("/checkadminauth", checkAdminAuth);
router.get('/logout',adminLogout)
module.exports = { router };
