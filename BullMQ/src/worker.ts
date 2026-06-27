import { Worker } from "bullmq";
import { connection } from "./queue.js";

const worker = new Worker(
  "emails",
  async (job) => {
    console.log("Catch Job", job);

    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
  {
    connection,
  },
);

worker.on("completed", (job) => {
  console.log(
    `Email sent to ${job?.data?.to} with subject ${job?.data?.subject}`,
  );
});

worker.on("failed", (job, error) => {
  console.log(
    `Email sending failed to ${job?.data?.to} with subject ${job?.data?.subject}: ${error}`,
  );
});

export { worker };
