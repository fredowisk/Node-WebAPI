import http from "node:http";
import handler from "./handler.js";
import { DEFAULT_PORT } from "./util/util.js";

const PORT = DEFAULT_PORT;

const server = http
  .createServer(async (request, response) => {
    await handler(request, response);
  })
  .listen(PORT, () => console.log(`server is running at ${PORT}`));

export { server };
