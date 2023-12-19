const express = require("express");
const router = express.Router();
const {
  SignupPost,
  LoginPost,
  checkUserAuth,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} = require("../controller/userController");
const { upload } = require("../storage/profilestorage");
router.post("/signup", upload.single("profile"), SignupPost);
router.post("/login", LoginPost);
router.get("/checkuserauth", checkUserAuth);
router.get('/logout',logoutUser)
router.get('/getuserprofile/:id',getUserProfile)
router.put('/updateuserprofile/:id',upload.single('profile'),updateUserProfile)
module.exports = { router };
