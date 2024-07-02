import { Module } from '@nestjs/common';
import { UserGunService } from './user-gun.service';
import { UserGunController } from './user-gun.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGunEntity } from './user-gun.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserGunEntity])],
  controllers: [UserGunController],
  providers: [UserGunService],
  exports: [UserGunService],
})
export class UserGunModule {}
