import express from "express";

import authenticateToken from "../helper/authHelper.js";

import PostDao from "../dao/postDao.js";

const postRouter = express.Router();

postRouter.post("/create", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { messageBody, messageLocation, threadSubject, visibilityRules } =
    req.body;

  const result = await PostDao.createPost(
    userId,
    messageBody,
    messageLocation,
    threadSubject,
    visibilityRules,
  );

  return res.status(result.status).json({ message: result.message });
});

postRouter.delete("/delete", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { threadId, messageId } = req.body;

  const result = await PostDao.deletePost(userId, threadId, messageId);

  return res.status(result.status).json({ message: result.message });
});

export default postRouter;
