import fsPromises from "node:fs/promises";

export default class HeroRepository {
  constructor({ filePath }) {
    this.file = filePath;
  }

  async #currentFileContent() {
    return JSON.parse(await fsPromises.readFile(this.file));
  }

  async find() {
    return this.#currentFileContent();
  }

  async create(data) {
    const currentFile = await this.#currentFileContent();
    currentFile.push(data);

    await fsPromises.writeFile(this.file, JSON.stringify(currentFile));

    return data.id;
  }

  async update(id, data) {
    const currentFile = await this.#currentFileContent();
    const updatedValues = currentFile.map((hero) => {
      if (hero.id === id) hero = { id, ...data };

      return hero;
    });

    await fsPromises.writeFile(this.file, JSON.stringify(updatedValues));
  }

  async delete(id) {
    const currentFile = await this.#currentFileContent();
    const valuesNotDeleted = currentFile.filter((hero) => hero.id !== id);

    await fsPromises.writeFile(this.file, JSON.stringify(valuesNotDeleted));
  }
}
