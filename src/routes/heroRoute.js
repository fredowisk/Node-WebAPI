import { once } from "node:events";
import Hero from "../entities/hero.js";
import { DEFAULT_HEADER_CONTENT } from "../util/util.js";

const routes = ({ heroService }) => ({
  "/heroes:get": async (request, response) => {
    const heroes = await heroService.find();
    response.writeHead(201, DEFAULT_HEADER_CONTENT);
    response.write(JSON.stringify({ results: heroes }));
    return response.end();
  },
  "/heroes:post": async (request, response) => {
    const data = await once(request, "data");
    const item = JSON.parse(data);
    const hero = new Hero(item);

    const id = await heroService.create(hero);

    response.writeHead(201, DEFAULT_HEADER_CONTENT);
    response.write(
      JSON.stringify({
        id,
        success: "User created with success!!",
      })
    );

    return response.end();
  },
  "/heroes:put": async (request, response) => {
    const data = await once(request, "data");
    const { id, ...item } = JSON.parse(data);

    await heroService.update(id, item);

    response.writeHead(201, DEFAULT_HEADER_CONTENT);
    response.write(
      JSON.stringify({
        success: "User updated with success!!",
      })
    );

    return response.end();
  },
  "/heroes:delete": async (request, response) => {
    const data = await once(request, "data");
    const {id} = JSON.parse(data);

    await heroService.delete(id);

    response.writeHead(201, DEFAULT_HEADER_CONTENT);
    response.write(
      JSON.stringify({
        success: "User deleted with success!!",
      })
    );

    return response.end();
  },
});

export { routes };
