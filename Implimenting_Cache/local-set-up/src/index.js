import mongoose from "mongoose";
import express from "express";
import Redis from "ioredis";

const app = express();
const redis = new Redis('redis://localhost:6379');

app.get("/redis", async (req, res) => {
    const reply = await redis.ping();

    res.json({redis: reply});
})

app.get("/mongo", async (req, res) => {
    const mongoUri = "mongodb://localhost:27017/test";

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri);
    }

    res.json({mongo: "connected", database: mongoose.connection.name})
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})