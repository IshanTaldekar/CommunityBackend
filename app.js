import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import { randomBytes } from "pg/lib/crypto/utils-webcrypto.js";

import authRouter from "./src/routes/auth.js";
import profileRouter from "./src/routes/profile.js";
import postRouter from "./src/routes/post.js";
import replyRouter from "./src/routes/reply.js";
import connectRouter from "./src/routes/connect.js";
import feedRouter from "./src/routes/feed.js";
import discoverRouter from "./src/routes/discover.js";

const app = express();

const PORT = process.env.PORT || 3000;

// Setup CORS middleware
app.use(cors());

// Setup body parser middleware to parse JSON
app.use(bodyParser.json());

const sessionSecret = randomBytes(32).toString("hex");
// Setup session middleware
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    },
  }),
);

app.use(`/api/auth`, authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/post", postRouter);
app.use("/api/reply", replyRouter);
app.use("/api/connect", connectRouter);
app.use("/api/feed", feedRouter);
app.use("/api/discover", discoverRouter);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
