import express from "express";
import { Redis } from "ioredis";

const app = express();
const redis = new Redis("redis://localhost:6379");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/otp", async (req, res) => {
  const { phone } = req.body;

  // Generate a random OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(otpKey(phone), otp, "EX", 30); // Set OTP with a TTL of 30 seconds

  res.status(200).json({ message: "OTP sent successfully", otp });
});

app.post("/verify", async (req, res) => {
  const { phone, otp } = req.body;

  const otpExipred = await redis.ttl(otpKey(phone));

  if (otpExipred === -2) {
    return res.status(400).json({ message: "OTP has expired" });
  }

  const storedOtp = await redis.get(otpKey(phone));

  if (storedOtp === otp) {
    await redis.del(otpKey(phone)); // Delete OTP after successful verification
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

const otpKey = (phone: string) => `otp:${phone}`;
