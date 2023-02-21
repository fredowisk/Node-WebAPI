import test from "node:test";
import assert from "node:assert";
import HeroService from "../../../src/services/heroService.js";

const callTracker = new assert.CallTracker();
process.on("exit", () => callTracker.verify());

test("Hero service test suite", async (t) => {
  const idMock = "10";
  const databaseMock = [{ id: idMock, name: "Batman", age: 50, power: "rich" }];

  await t.test("it should call repository.find when call find", async (t) => {
    const repositoryStub = {
      find: callTracker.calls(() => Promise.resolve(databaseMock)),
    };

    const heroService = new HeroService({ heroRepository: repositoryStub });

    const heroData = await heroService.find();

    assert.deepStrictEqual(heroData, databaseMock, "find should return all heroes");
  });

  await t.test("it should call repository.create when call create", async (t) => {
    const repositoryStub = {
      create: callTracker.calls(() => Promise.resolve(idMock)),
    };

    const heroService = new HeroService({ heroRepository: repositoryStub });

    const heroId = await heroService.create();

    assert.strictEqual(heroId, idMock);
  });

  await t.test('it should call repository.update when call update', async (t) => {
    const repositoryStub = {
      update: callTracker.calls(() => {})
    }

    const heroService = new HeroService({heroRepository: repositoryStub});

    await heroService.update();
  })

  await t.test('it should call repository.delete when call delete', async (t) => {
    const repositoryStub = {
      delete: callTracker.calls(() => {})
    }

    const heroService = new HeroService({heroRepository: repositoryStub});

    await heroService.delete();
  })
});
