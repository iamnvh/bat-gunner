import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { BoostEntity } from 'src/boost/boost.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoostSeedService {
  constructor(
    @InjectRepository(BoostEntity)
    private repository: Repository<BoostEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();
    if (!count) {
      const filePath = process.cwd() + '/src/database/seeds/boost/boost.json';
      const bufferData = readFileSync(filePath);
      const data = JSON.parse(bufferData.toString());
      for (let i = 0; i < data.length; i++) {
        const element = data[i];

        const newBoost = new BoostEntity();
        newBoost.title = element.title;
        newBoost.cost = element.cost;
        newBoost.rate = element.rate;
        newBoost.level = element.level;

        await this.repository.save(newBoost);
      }
      console.log('Add boost success');
    }
  }
}
