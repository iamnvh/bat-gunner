import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { GunSeedService } from './gun/gun-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(GunSeedService).run();

  await app.close();
};

void runSeed();
