import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from './game.entity';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { UserModule } from 'src/user/user.module';
import { ClaimModule } from 'src/claim/claim.module';
import { GunModule } from 'src/gun/gun.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameEntity]),
    UserModule,
    ClaimModule,
    GunModule,
  ],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
