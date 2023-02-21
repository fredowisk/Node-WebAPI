import test from "node:test";
import assert from "node:assert";
import { Readable } from "node:stream";

import { routes } from "../../../src/routes/heroRoute.js";
import { DEFAULT_HEADER_CONTENT } from "../../../src/util/util.js";

const callTracker = new assert.CallTracker();
process.on("exit", () => callTracker.verify());

test("Hero routes - endpoints test suite", async (t) => {
  const idMock = "10";
  const databaseMock = [{ id: idMock, name: "Batman", age: 50, power: "rich" }];

  const heroServiceStub = {
    find: async () => databaseMock,
    create: async () => idMock,
    update: async () => {},
    delete: async () => {},
  };

  const heroRoutes = routes({ heroService: heroServiceStub });

  await t.test("it should call /heroes:get route", async (t) => {
    const request = {};

    const response = {
      writeHead: callTracker.calls((status, header) => {
        assert.strictEqual(status, 201);
        assert.strictEqual(header, DEFAULT_HEADER_CONTENT);
      }),

      write: callTracker.calls((heroes) => {
        const expected = JSON.stringify({ results: databaseMock });
        assert.strictEqual(
          heroes,
          expected,
          "write should be called with the correct payload"
        );
      }),

      end: callTracker.calls((item) =>
        assert.strictEqual(item, undefined, "end should be called without args")
      ),
    };

    const endpoint = "/heroes:get";
    const route = heroRoutes[endpoint];
    await route(request, response);
  });

  await t.test("it should call /heroes:post route", async (t) => {
    const successMessage = "User created with success!!";
    const heroMock = { name: "Batman", age: 50, power: "rich" };

    const request = new Readable({
      read() {
        this.push(JSON.stringify(heroMock));
        this.push(null);
      },
    });

    const response = {
      writeHead: callTracker.calls((status, header) => {
        assert.strictEqual(status, 201);
        assert.strictEqual(header, DEFAULT_HEADER_CONTENT);
      }),

      write: callTracker.calls((data) => {
        const expected = JSON.stringify({
          id: idMock,
          success: successMessage,
        });

        assert.strictEqual(
          data,
          expected,
          "write should be called with correct id, and success message"
        );
      }),

      end: callTracker.calls((item) =>
        assert.strictEqual(item, undefined, "end should be called without args")
      ),
    };

    const endpoint = "/heroes:post";
    const route = heroRoutes[endpoint];
    await route(request, response);
  });

  await t.test("it should call /heroes:put route", async (t) => {
    const successMessage = "User updated with success!!";
    const [heroMock] = databaseMock;
    heroMock.age = 51;

    const request = new Readable({
      read() {
        this.push(JSON.stringify(heroMock));
        this.push(null);
      },
    });

    const response = {
      writeHead: callTracker.calls((status, header) => {
        assert.strictEqual(status, 201);
        assert.strictEqual(header, DEFAULT_HEADER_CONTENT);
      }),

      write: callTracker.calls((message) => {
        const expected = JSON.stringify({ success: successMessage });
        assert.strictEqual(
          message,
          expected,
          "write should be called with success message"
        );
      }),

      end: callTracker.calls((item) =>
        assert.strictEqual(item, undefined, "end should be called without args")
      ),
    };

    const endpoint = "/heroes:put";
    const route = heroRoutes[endpoint];
    await route(request, response);
  });

  await t.test("it should call /heroes:delete route", async (t) => {
    const successMessage = "User deleted with success!!";

    const request = new Readable({
      read() {
        this.push(idMock);
        this.push(null);
      },
    });

    const response = {
      writeHead: callTracker.calls((status, header) => {
        assert.strictEqual(status, 201);
        assert.strictEqual(header, DEFAULT_HEADER_CONTENT);
      }),

      write: callTracker.calls((message) => {
        const expected = JSON.stringify({ success: successMessage });
        assert.strictEqual(
          message,
          expected,
          "write should be called with success message"
        );
      }),
      end: callTracker.calls((item) =>
        assert.strictEqual(item, undefined, "end should be called without args")
      ),
    };

    const endpoint = "/heroes:delete";
    const route = heroRoutes[endpoint];
    await route(request, response);
  });
});
