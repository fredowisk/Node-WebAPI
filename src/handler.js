import path from "node:path";
import { fileURLToPath, parse } from "node:url";
import { generateInstance } from "./factories/heroFactory.js";
import { routes } from "./routes/heroRoute.js";
import {
  DEFAULT_HEADER_CODE,
  DEFAULT_HEADER_CONTENT,
  ERROR_HEADER_CODE,
} from "./util/util.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(currentDir, "./../database", "data.json");

const heroRoutes = routes({
  heroService: generateInstance({ filePath }),
});

const allRoutes = {
  ...heroRoutes,
  default: (request, response) => {
    response.writeHead(DEFAULT_HEADER_CODE, DEFAULT_HEADER_CONTENT);
    response.write("Page not found!");
    return response.end();
  },
};

async function handler(request, response) {
  const { url, method } = request;

  const { pathname } = parse(url, true);

  const key = `${pathname}:${method.toLowerCase()}`;
  const chosen = allRoutes[key] || allRoutes.default;

  return Promise.resolve(chosen(request, response)).catch(
    handlerError(response)
  );
}

function handlerError(response) {
  return (error) => {
    console.log("Something bad has happened**", error.stack);
    response.writeHead(ERROR_HEADER_CODE, DEFAULT_HEADER_CONTENT);
    response.write(
      JSON.stringify({
        error: "internal server error!!",
      })
    );
    return response.end();
  };
}

export default handler;
