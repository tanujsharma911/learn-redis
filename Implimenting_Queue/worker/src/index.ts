import { createClient } from "redis";

const client = createClient();

const main = async () => {
  await client.connect();

  while (1) {
    const response = await client.RPOP("submissions");

    if (response === null) continue;
    console.log(response);
  }
};

main();
