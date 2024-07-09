import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { MissionEntity } from 'src/mission/mission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MissionSeedService {
  constructor(
    @InjectRepository(MissionEntity)
    private repository: Repository<MissionEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();
    if (!count) {
      const filePath =
        process.cwd() + '/src/database/seeds/mission/missions.json';
      const bufferData = readFileSync(filePath);
      const data = JSON.parse(bufferData.toString());
      for (let i = 0; i < data.length; i++) {
        const element = data[i];

        const newMission = new MissionEntity();

        newMission.link = element.link;
        newMission.reward = element.reward;
        newMission.title = element.title;
        newMission.type = element.type;
        newMission.ticket = element.ticket;

        await this.repository.save(newMission);
      }
      console.log('Add mission success');
    }
  }
}
