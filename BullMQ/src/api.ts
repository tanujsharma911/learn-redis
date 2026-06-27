import express from "express";
import { queue } from "./queue.js";

const app = express();

app.use(express.json());

app.post("/emails/send", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  await queue.add(
    "emails",
    { to: to, subject: subject, text: text },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    },
  );

  res.status(200).json({ message: "Email queued for sending" });
});

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
