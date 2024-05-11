import express from "express";

import authenticateToken from "../helper/authHelper.js";

import FeedDao from "../dao/feedDao.js";

const feedRouter = express.Router();

feedRouter.get("/friend", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const result = await FeedDao.getLatestFriendFeed(userId);

  if (result.status !== 200) {
    return res.status(result.status).json({ message: result.message });
  }

  return res
    .status(result.status)
    .json({ message: result.message, posts: result.posts });
});

feedRouter.get("/neighbor", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const result = await FeedDao.getLatestNeighborFeed(userId);

  if (result.status !== 200) {
    return res.status(result.status).json({ message: result.message });
  }

  return res
    .status(result.status)
    .json({ message: result.message, posts: result.posts });
});

feedRouter.get("/block", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const result = await FeedDao.getLatestBlockFeed(userId);

  if (result.status !== 200) {
    return res.status(result.status).json({ message: result.message });
  }

  return res
    .status(result.status)
    .json({ message: result.message, posts: result.posts });
});

feedRouter.get("/neighborhood", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const result = await FeedDao.getLatestNeighborhoodFeed(userId);

  if (result.status !== 200) {
    return res.status(result.status).json({ message: result.message });
  }

  return res
    .status(result.status)
    .json({ message: result.message, posts: result.posts });
});

feedRouter.get("/all", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const result = await FeedDao.getLatestCombinedFeed(userId);

  if (result.status !== 200) {
    return res.status(result.status).json({ message: result.message });
  }

  return res
    .status(result.status)
    .json({ message: result.message, posts: result.posts });
});

export default feedRouter;
