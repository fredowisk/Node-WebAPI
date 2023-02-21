export default class HeroService {
  constructor({ heroRepository }) {
    this.heroRepository = heroRepository;
  }

  async find() {
    return this.heroRepository.find();
  }

  async create(data) {
    return this.heroRepository.create(data);
  }

  async update(id, data) {
    return this.heroRepository.update(id, data);
  }

  async delete(id) {
    return this.heroRepository.delete(id);
  }
}
