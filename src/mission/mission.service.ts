import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { MissionEntity } from './mission.entity';
import { readFileSync } from 'fs';
import { CLAIM_TYPE, MISSION_STATUS } from 'src/utils/constants';
import { ClaimService } from 'src/claim/claim.service';
import { PageDto } from 'src/utils/dto/page.dto';

const bufferData = readFileSync(
  process.cwd() + '/src/mission/data/mission.json',
);
const missions: any[] = JSON.parse(bufferData.toString());

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(MissionEntity)
    private readonly missionRepository: Repository<MissionEntity>,
    private readonly claimService: ClaimService,
  ) {}

  findOne(fields: EntityCondition<MissionEntity>) {
    return this.missionRepository.findOne({
      where: fields,
    });
  }

  async create(mission: MissionEntity): Promise<MissionEntity> {
    return this.missionRepository.save(mission);
  }

  async syncMission(userId: string) {
    const queries = missions.map((mission) =>
      this.missionRepository.save({
        title: mission.title,
        reward: mission.reward,
        userId: userId,
        type: mission.type,
      } as MissionEntity),
    );

    await Promise.all(queries);
  }

  async getMissionsByUserId(params: PageDto & { userId: string }) {
    return this.missionRepository
      .createQueryBuilder('mission')
      .where('mission.userId = :userId', { userId: params.userId })
      .select([
        'mission.id as id',
        'mission.reward as reward',
        'mission.status as status',
        'mission.title as title',
        'mission.type as type',
        'mission.updatedAt as "updatedAt"',
      ])
      .offset(params.offset)
      .limit(params.limit)
      .getRawMany();
  }

  async update(params: { missionId: string; userId: string }) {
    const mission = await this.missionRepository
      .createQueryBuilder('mission')
      .update(MissionEntity)
      .set({
        status: MISSION_STATUS.FINISHED,
      })
      .where('mission.id = :missionId', { missionId: params.missionId })
      .andWhere('mission."userId" = :userId', { userId: params.userId })
      .andWhere('mission.status = :status', {
        status: MISSION_STATUS.NOT_STARTED,
      })
      .execute();

    if (mission.affected && mission.affected > 0) {
      const missionById = await this.findOne({
        id: params.missionId,
      });

      if (!missionById) {
        throw new BadGatewayException('not_found_mission');
      }

      await this.claimService.create({
        typeClaim: CLAIM_TYPE.CLAIM_FOR_MISSION,
        userId: params.userId,
        point: missionById.reward,
      });
    }
  }
}
