import Express from "express";
import { Redis } from "ioredis";

const app = Express();

const redis = new Redis("redis://localhost:6379");

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const BANNER_KEY = "site-banner";

app.post("/banner", async (req, res) => {
  const { banner } = req.body;

  if (!banner) {
    return res.status(400).json({ error: "Banner is required" });
  }

  await redis.set(BANNER_KEY, banner);
  res.json({ message: "Banner updated successfully" });
});

app.get("/banner", async (req, res) => {
  const banner = await redis.get(BANNER_KEY);
  res.json({ banner });
});

app.delete("/banner", async (req, res) => {
  await redis.del(BANNER_KEY);
  res.json({ message: "Banner deleted successfully" });
});

app.get("/banner/exists", async (req, res) => {
  const exists = await redis.exists(BANNER_KEY);
  res.json({ exists: exists === 1 });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
