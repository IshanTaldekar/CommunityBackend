import express from "express";

import authenticateToken from "../helper/authHelper.js";

import DiscoverDao from "../dao/discoverDao.js";

const discoverRouter = express.Router();

discoverRouter.get("/user", authenticateToken, async (req, res) => {
  const { searchKey } = req.body;

  const result = await DiscoverDao.searchUsers(searchKey);

  if (result.status !== 200) {
    return res.status(result.status).json({ message: result.message });
  }

  return res
    .status(result.status)
    .json({ message: result.message, User: result.User });
});

discoverRouter.get("/post", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { searchKey, messageLocation } = req.body;

  if (messageLocation === null) {
    const result = await DiscoverDao.searchPosts(userId, searchKey);

    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }

    return res
      .status(result.status)
      .json({ message: result.message, posts: result.posts });
  }

  const result = await DiscoverDao.searchPostsWithLocation(
    userId,
    searchKey,
    messageLocation,
  );

  if (result.status !== 200) {
    return res.status(result.status).json({ message: result.message });
  }

  return res
    .status(result.status)
    .json({ message: result.message, posts: result.posts });
});

export default discoverRouter;
