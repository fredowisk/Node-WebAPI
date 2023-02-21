import fs from "node:fs/promises";
import path from "node:path";

const databaseMock = [{ id: "10", name: "Batman", age: 50, power: "rich" }];

async function resetTestDatabase(currentDir) {
  const filePath = path.join(currentDir, "../database/", "data.json");
  await fs.writeFile(filePath, JSON.stringify(databaseMock));
}

export default resetTestDatabase;
