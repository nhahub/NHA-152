const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  updateProfilePicture,
  uploadProfilePicture,
  updateAccountDetails,
} = require("../../controllers/auth/auth-controller");
const { upload } = require("../../helpers/cloudinary");
const User = require("../../models/User");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware, async (req, res) => {
  try {
    const userFromToken = req.user;
    const user = await User.findById(userFromToken.id).select("-password");
    res.status(200).json({
      success: true,
      message: "Authenticated user!",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        userName: user.userName,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user data",
    });
  }
});
router.post("/upload-profile-picture", upload.single("my_file"), uploadProfilePicture);
router.put("/update-profile-picture/:userId", authMiddleware, updateProfilePicture);
router.put("/update-account/:userId", authMiddleware, updateAccountDetails);

module.exports = router;
