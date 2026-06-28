import express from "express";
import { Redis } from "ioredis";

const app = express();
const redis = new Redis("redis://localhost:6379");

app.use(express.json());

const LEADERBOARD_KEY = "leaderboard";

app.post("/leaderboard/score", async (req, res) => {
  await redis.zincrby(LEADERBOARD_KEY, req.body.points, req.body.userId);

  res.status(200).json({ message: "Success" });
});

app.get("/leaderboard", async (req, res) => {
  const rankings = await redis.zrange(
    LEADERBOARD_KEY,
    0,
    9,
    "REV",
    "WITHSCORES",
  );

  res.status(200).json({ rankings });
});

app.get("/leaderboard/rank", async (req, res) => {
  const rank = await redis.zrevrank(LEADERBOARD_KEY, req.body.userId);
  const score = await redis.zscore(LEADERBOARD_KEY, req.body.userId);

  res.status(200).json({
    rank,
    score,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
