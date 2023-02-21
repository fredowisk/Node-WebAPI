import test from "node:test";
import assert from "node:assert";

import { generateInstance } from "../../../src/factories/heroFactory.js";
import HeroService from "../../../src/services/heroService.js";

test("Hero factory test suite", (t) => {
  t.test(
    "it should generate a heroService instance when call generateInstance",
    (t) => {
      const filePath = "fakeFilePath";

      const heroServiceInstance = generateInstance({ filePath });
      assert.ok(heroServiceInstance instanceof HeroService);
    }
  );
});
