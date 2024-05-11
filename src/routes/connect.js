import express from "express";

import authenticateToken from "../helper/authHelper.js";

import ConnectDao from "../dao/connectDao.js";

const connectRouter = express.Router();

connectRouter.post(
  "/friend/request/new",
  authenticateToken,
  async (req, res) => {
    const userId = req.user.userId;
    const { requesteeId } = req.body;

    const result = await ConnectDao.sendFriendRequest(userId, requesteeId);

    return res.status(result.status).json({ message: result.message });
  },
);

connectRouter.post(
  "/friend/request/cancel",
  authenticateToken,
  async (req, res) => {
    const userId = req.user.userId;
    const { requesteeId } = req.body;

    const result = await ConnectDao.cancelFriendRequest(userId, requesteeId);

    return res.status(result.status).join({ message: result.message });
  },
);

connectRouter.post(
  "/friend/request/response",
  authenticateToken,
  async (req, res) => {
    const userId = req.user.userId;
    const { requesterId, acceptedFlag } = req.body;

    const result = await ConnectDao.sendFriendRequestResponse(
      requesterId,
      userId,
      acceptedFlag,
    );

    return res.status(result.status).json({ message: result.message });
  },
);

connectRouter.post("/neighbor/add", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { neighborId } = req.body;

  const result = await ConnectDao.addNeighbor(userId, neighborId);

  return res.status(result.status).json({ message: result.message });
});

connectRouter.get("/friend/all", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  const result = await ConnectDao.getFriendsList(userId);

  if (result.status !== 200) {
    return res.status(result.status).json({ message: result.message });
  }

  return res
    .status(result.status)
    .json({ message: result.message, friends: result.friends });
});

connectRouter.get("/neighbors/all", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  const result = await ConnectDao.getNeighborList(userId);

  if (result.status !== 200) {
    return res.status(result.status).json({ message: result.message });
  }
  return res
    .status(result.status)
    .json({ message: result.message, neighbors: result.neighbors });
});

export default connectRouter;
