import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { GunEntity } from 'src/gun/gun.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GunSeedService {
  constructor(
    @InjectRepository(GunEntity)
    private repository: Repository<GunEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();
    if (!count) {
      const filePath = process.cwd() + '/src/database/seeds/gun/guns.json';
      const bufferData = readFileSync(filePath);
      const data = JSON.parse(bufferData.toString());
      for (let i = 0; i < data.length; i++) {
        const element = data[i];

        const newGun = new GunEntity();

        newGun.price = element.price;
        newGun.type = element.type;
        newGun.title = element.title;

        await this.repository.save(newGun);
      }
      console.log('Add gun success');
    }
  }
}
