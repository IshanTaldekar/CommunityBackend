import express from "express";

import authenticateToken from "../helper/authHelper.js";

import ReplyDao from "../dao/replyDao.js";

const replyRouter = express.Router();

replyRouter.post("/create", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { messageBody, messageLocation, originalMessageId, threadId } =
    req.body;

  const result = await ReplyDao.createReply(
    userId,
    messageBody,
    messageLocation,
    originalMessageId,
    threadId,
  );

  return res.status(result.status).json({ message: result.message });
});

replyRouter.delete("/delete", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { replyId } = req.body;

  const result = await ReplyDao.deleteReply(userId, replyId);

  return res.status(result.status).json({ message: result.message });
});

export default replyRouter;
