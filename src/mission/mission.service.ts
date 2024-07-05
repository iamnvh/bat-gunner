import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { MissionEntity } from './mission.entity';
import { MissionDto } from './dto/mission.dto';
import { UserMissionService } from 'src/user-mission/user-mission.service';

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(MissionEntity)
    private readonly missionRepository: Repository<MissionEntity>,
    @Inject(forwardRef(() => UserMissionService))
    private readonly userMissionService: UserMissionService,
  ) {}

  findOne(fields: EntityCondition<MissionEntity>) {
    return this.missionRepository.findOne({
      where: fields,
    });
  }

  find() {
    return this.missionRepository.find();
  }

  async create(mission: MissionEntity): Promise<MissionEntity> {
    return this.missionRepository.save(mission);
  }

  async update(args: MissionDto) {
    await Promise.all([
      this.userMissionService.updateAllStatusByMissionId(args.id),
      this.missionRepository
        .createQueryBuilder('mission')
        .update(MissionEntity)
        .andWhere('mission.id = :missionId', { missionId: args.id })
        .set({
          title: args.title,
          reward: args.reward,
          link: args.link,
        })
        .execute(),
    ]);
  }
}
