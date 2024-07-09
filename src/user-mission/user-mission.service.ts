import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMissionEntity } from './user-mission.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { MissionEntity } from 'src/mission/mission.entity';
import { MissionService } from 'src/mission/mission.service';
import { ClaimType, MissionStatusType } from 'src/utils/constants';
import { PageDto } from 'src/utils/dto/page.dto';
import { ClaimService } from 'src/claim/claim.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserMissionService {
  constructor(
    @InjectRepository(UserMissionEntity)
    private readonly userMissionRepository: Repository<UserMissionEntity>,
    private readonly missionService: MissionService,
    private readonly claimService: ClaimService,
    private readonly userService: UserService,
  ) {}

  findOne(fields: FindOneOptions<UserMissionEntity>) {
    return this.userMissionRepository.findOne(fields);
  }

  async syncMission(userId: string) {
    const listMission = await this.missionService.find();

    await Promise.all(
      listMission.map((mission) => {
        return this.create({
          userId: userId,
          missionId: mission.id,
          status: MissionStatusType.NOT_STARTED,
        } as UserMissionEntity);
      }),
    );
  }

  async create(item: UserMissionEntity) {
    const res = await this.userMissionRepository.findOne({
      where: { userId: item.userId, missionId: item.missionId },
    });
    if (!!res?.id) {
      return res;
    }
    return this.userMissionRepository.insert(item);
  }

  save(userId: string, item: MissionEntity) {
    return this.userMissionRepository.update({ user: { id: userId } }, item);
  }

  async getMissionByUserId(params: PageDto & { userId: string }) {
    return this.userMissionRepository
      .createQueryBuilder('user-mission')
      .leftJoin('mission', 'mission', 'mission.id = user-mission.missionId')
      .where('user-mission.userId = :userId', { userId: params.userId })
      .select([
        'mission.id as id',
        'mission.title as title',
        'mission.reward as reward',
        'mission.link as link',
        'mission.type as type',
        'mission.ticket as ticket',
        'user-mission.status as status',
      ])
      .offset(params.offset)
      .limit(params.limit)
      .getRawMany();
  }

  async claimMissionByUserId(args: { userId: string; missionId: string }) {
    const userMission = await this.userMissionRepository
      .createQueryBuilder()
      .update(UserMissionEntity)
      .set({
        status: MissionStatusType.FINISHED,
      })
      .where('"missionId" = :missionId', {
        missionId: args.missionId,
      })
      .andWhere('"userId" = :userId', { userId: args.userId })
      .execute();

    if (userMission.affected && userMission.affected > 0) {
      const mission = await this.missionService.findOne({ id: args.missionId });
      if (!mission) {
        throw new BadGatewayException('not_found_mission');
      }

      if (mission.reward > 0) {
        await this.claimService.create({
          typeClaim: ClaimType.CLAIM_FOR_MISSION,
          userId: args.userId,
          point: mission.reward,
        });
      }

      if (mission.ticket > 0) {
        await this.userService.handleTicket({
          userId: args.userId,
          tickets: mission.ticket,
        });
      }
    }
  }

  async updateAllStatusByMissionId(missionId: string) {
    return this.userMissionRepository
      .createQueryBuilder()
      .update(UserMissionEntity)
      .set({ status: MissionStatusType.NOT_STARTED })
      .where('missionId = :missionId', { missionId })
      .execute();
  }
}
