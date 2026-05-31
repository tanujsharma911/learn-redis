import express, { type Request, type Response } from "express";
import { createClient } from "redis";

const app = express();

app.use(express.json());

const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));
await client.connect();

app.post("/submit", (req: Request, res: Response) => {
  const { userId, problemId, code, language } = req.body;

  client.LPUSH(
    "submissions",
    JSON.stringify({ problemId, userId, code, language }),
  );

  res.status(200).json({ message: "Saved" });
});

app.listen(3000, () => {
  console.log("Server is running at https://localhost:3000...")
})
