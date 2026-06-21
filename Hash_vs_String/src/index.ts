import { Redis } from "ioredis";

const redis = new Redis();

async function stringExample() {
  await redis.set(
    "user:123",
    JSON.stringify({ name: "Alice", age: 30, country: "USA" }),
  );

  const userInfo = await redis.get("user:123");

  if (!userInfo) {
    console.log("User not found");
    return;
  }

  const user = JSON.parse(userInfo);

  console.log(user);
}

async function hashExample() {
  await redis.hset("user:124", {
    name: "Bob",
    age: "25",
    country: "Canada",
  });

  const userInfo = await redis.hgetall("user:124");

  if (Object.keys(userInfo).length === 0) {
    console.log("User not found");
    return;
  }

  console.log(userInfo);
}

async function updateHashExample() {
  await redis.hset("user:124", "age", "26");

  const updatedUserInfo = await redis.hgetall("user:124");

  console.log(updatedUserInfo);
}


// Race condition will occur
stringExample().catch(console.error);

hashExample().catch(console.error);

updateHashExample().catch(console.error);
