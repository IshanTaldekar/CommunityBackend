import express from "express";
import multer from "multer";

import authenticateToken from "../helper/authHelper.js";

import ProfileDao from "../dao/profileDao.js";

const profileRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

profileRouter.post(
  "/update/picture",
  authenticateToken,
  upload.single("picture"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const userId = req.user.userId;
    const originalImageBuffer = req.file.buffer;

    const result = await ProfileDao.updateUserProfilePicture(
      userId,
      originalImageBuffer,
    );

    return res.status(result.status).json({ message: result.message });
  },
);

profileRouter.post("/update/bio", authenticateToken, async (req, res) => {
  const { bio } = req.body;
  const userId = req.user.userId;

  const result = await ProfileDao.updateUserBio(userId, bio);

  return res.status(result.status).json({ message: result.message });
});

profileRouter.post("/update/address", authenticateToken, async (req, res) => {
  const { addressId } = req.body;
  const userId = req.user.userId;

  const result = await ProfileDao.updateUserAddress(userId, addressId);

  return res.status(result.status).json({ message: result.message });
});

profileRouter.get("/bio", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  const result = await ProfileDao.getUserBio(userId);

  return res.status(result.status).json({
    message: result.message,
    bio: result.bio,
  });
});

profileRouter.get("/picture/original", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  const result = await ProfileDao.getUserProfilePicture(userId);

  if (result.status !== 200) {
    return res.status(result.status).json({ message: result.message });
  }

  res.send({
    status: result.status,
    image: result.image,
    contentType: "image/jpeg",
  });
});

profileRouter.get("/picture/thumbnail", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  const result = await ProfileDao.getUserProfilePictureThumbnail(userId);

  if (result.status !== 200) {
    return res.status(result.status).json({ message: result.message });
  }

  res.send({
    status: result.status,
    image: result.image,
    contentType: "image/jpeg",
  });
});

profileRouter.get("/address", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  const result = await ProfileDao.getUserAddress(userId);

  if (result.status !== 200) {
    return res.status(result.status).json({ message: result.message });
  }

  res.send({
    status: result.status,
    message: result.message,
    address: result.address,
  });
});

profileRouter.get("/user", authenticateToken, async (req, res) => {
  const { userId } = req.body;
  const result = await ProfileDao.getUserInformation(userId);

  if (result.status !== 200) {
    return res.status(result.status).json({ message: result.message });
  }

  res.send({
    status: result.status,
    message: result.message,
    User: result.User,
  });
});

export default profileRouter;
