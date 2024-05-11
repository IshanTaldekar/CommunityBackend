import express from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

import UserDao from "../dao/userDao.js";

config();

const authRouter = express.Router();

authRouter.put("/register", async (req, res) => {
  const { firstName, lastName, emailAddress, password } = req.body;
  const result = await UserDao.registerNewUser(
    firstName,
    lastName,
    emailAddress,
    password,
  );
  res.status(result.status).json({ message: result.message });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await UserDao.authenticateUser(email, password);

    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }

    const token = jwt.sign(
      {
        userId: result.user.user_id,
        email: result.user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    console.log(token);

    res.json({
      status: 200,
      message: "Login successful.",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

authRouter.post("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Failed to destroy the session during logout", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.clearCookie("connect.sid", { path: "/" });
    res.status(200).json({ message: "Logout successful" }).end();
  });
});

export default authRouter;
