import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { GunSeedService } from './gun/gun-seed.service';
import { MissionSeedService } from './mission/mission-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(GunSeedService).run();
  await app.get(MissionSeedService).run();

  await app.close();
};

void runSeed();
