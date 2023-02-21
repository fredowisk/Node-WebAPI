import test from "node:test";
import assert from "node:assert";
import fsPromises from "node:fs/promises";

import HeroRepository from "../../../src/repositories/heroRepository.js";

const callTracker = new assert.CallTracker();
process.on("exit", () => callTracker.verify());

test("Hero repository test suite", async (t) => {
  const filePath = "fakeFilePath";

  const idMock = "10";
  const databaseMock = [{ id: idMock, name: "Batman", age: 50, power: "rich" }];

  const readFileMock = () =>
    (fsPromises.readFile = callTracker.calls((path) => {
      assert.strictEqual(
        path,
        filePath,
        "readFile should be called with fakeFilePath"
      );
      return Promise.resolve(JSON.stringify(databaseMock));
    }));

  const writeFileMock = () =>
    (fsPromises.writeFile = callTracker.calls((path) => {
      assert.strictEqual(
        path,
        filePath,
        "writeFile should be called with fakeFilePath"
      );
      return Promise.resolve();
    }));

  t.beforeEach(readFileMock);

  const heroRepository = new HeroRepository({ filePath });

  await t.test("it should call find and return a heroes list", async (t) => {
    const result = await heroRepository.find();
    assert.deepStrictEqual(result, databaseMock);
    assert.ok(Array.isArray(result));
    assert.ok(result.length >= 1);
  });

  await t.test("it should call create and return a hero id", async (t) => {
    writeFileMock();

    const [heroMock] = databaseMock;
    const id = await heroRepository.create(heroMock);

    const [writeArgs] = callTracker.getCalls(fsPromises.writeFile);

    assert.strictEqual(id, idMock);
    assert.strictEqual(
      writeArgs.arguments[1],
      JSON.stringify([...databaseMock, ...databaseMock]),
      "writeFile should be called with 1 more hero"
    );
  });

  await t.test(
    "it should call update and change a hero information",
    async (t) => {
      writeFileMock();

      const [{ id, ...heroMock }] = databaseMock;
      heroMock.age = 19;
      await heroRepository.update(id, heroMock);

      const [writeArgs] = callTracker.getCalls(fsPromises.writeFile);

      assert.notStrictEqual(
        writeArgs.arguments[1],
        JSON.stringify(databaseMock),
        "writeFile should be called with updated hero"
      );
    }
  );

  await t.test(
    "it should call delete and remove a hero from database",
    async (t) => {
      writeFileMock();

      await heroRepository.delete(idMock);

      const [writeArgs] = callTracker.getCalls(fsPromises.writeFile);

      assert.strictEqual(
        writeArgs.arguments[1],
        "[]",
        "write should be called with empty array"
      );
    }
  );
});
