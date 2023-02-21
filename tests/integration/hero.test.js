import test from "node:test";
import assert from "node:assert";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import resetTestDatabase from "./util/util.js";

test("Hero Integration Test Suite", async (t) => {
  const testPort = 9009;

  process.env.PORT = testPort;

  const currentDir = path.dirname(fileURLToPath(import.meta.url));

  path.dirname = () => currentDir;

  const { server } = await import("../../src/index.js");

  const testServerAddress = `http://localhost:${testPort}/heroes`;

  await t.test("it should get all heroes", async (t) => {
    const response = await fetch(testServerAddress, {
      method: "GET",
    });

    const { results } = await response.json();

    assert.strictEqual(response.status, 201);
    assert.ok(results.length >= 1);
  });

  await t.test("it should create a hero", async (t) => {
    const heroData = {
      name: "Batman",
      age: 50,
      power: "rich",
    };

    const response = await fetch(testServerAddress, {
      method: "POST",
      body: JSON.stringify(heroData),
    });

    const result = await response.json();

    assert.strictEqual(
      response.headers.get("content-type"),
      "application/json"
    );
    assert.strictEqual(response.status, 201);

    assert.strictEqual(
      result.success,
      "User created with success!!",
      "it should return a valid text message"
    );

    assert.ok(result.id.length > 30, "id should be a valid uuid");
  });

  await t.test("it should update a hero", async (t) => {
    const idMock = "10";
    const heroData = {
      id: idMock,
      name: "Batman",
      age: 51,
      power: "rich",
    };

    const response = await fetch(testServerAddress, {
      method: "PUT",
      body: JSON.stringify(heroData),
    });

    const result = await response.json();

    assert.strictEqual(
      response.headers.get("content-type"),
      "application/json"
    );
    assert.strictEqual(
      result.success,
      "User updated with success!!",
      "it should return a valid text message"
    );
    assert.strictEqual(response.status, 201);
  });

  await t.test("it should delete a hero", async (t) => {
    const idMock = "10";

    const response = await fetch(testServerAddress, {
      method: "DELETE",
      body: JSON.stringify({ id: idMock }),
    });

    const result = await response.json();

    assert.strictEqual(
      response.headers.get("content-type"),
      "application/json"
    );

    assert.strictEqual(
      result.success,
      "User deleted with success!!",
      "it should return a valid text message"
    );

    assert.strictEqual(response.status, 201);
  });

  await t.test(
    "it should call the default route when the route doesn't exist",
    async (t) => {
      const expectedMessage = "Page not found!";
      const expectedStatus = 404;

      const fakeServerAddress = `${testServerAddress}s`;
      const response = await fetch(fakeServerAddress);

      const message = await response.text();

      assert.strictEqual(
        response.headers.get("content-type"),
        "application/json"
      );
      assert.strictEqual(response.status, expectedStatus);
      assert.strictEqual(message, expectedMessage);
    }
  );

  await t.test(
    "it should call the handlerError when handler throws an error",
    async (t) => {
      const expectedMessage = "internal server error!!";

      const log = console.log;

      console.log = () => {};

      const response = await fetch(testServerAddress, {
        method: "POST",
        body: '{"invalid json payload"}',
      });

      const { error } = await response.json();

      assert.strictEqual(error, expectedMessage);

      console.log = log;
    }
  );

  await resetTestDatabase(currentDir);

  await promisify(server.close.bind(server))();
});
