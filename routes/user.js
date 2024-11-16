const express = require("express");
const {
  createUser,
  login,
  resetPassword,
  newPassword,
  forgotPassword,
  updatePersonalInfo,
  uploadProfilePic,
} = require("../controller/user");
const { checkJWT } = require("../middleware/authentication");
const { uploadImages } = require("../middleware/multer");
const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", login);

userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/new-password", newPassword);
userRouter.post("/reset-password", checkJWT, resetPassword);

userRouter.patch("/personal", checkJWT, updatePersonalInfo);
userRouter.patch(
  "/personal/profile",
  checkJWT,
  uploadImages({ fieldName: "profilePic", isRequired: true, isSinlge: true }),
  uploadProfilePic
);

module.exports = userRouter;
