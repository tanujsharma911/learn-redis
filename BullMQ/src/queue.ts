import { Queue } from "bullmq";

const connection = {
  host: "localhost",
  port: 6379,
};

const queue = new Queue("emails", {
  connection,
});

export { queue, connection };
