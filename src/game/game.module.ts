import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from './game.entity';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { UserModule } from 'src/user/user.module';
import { ClaimModule } from 'src/claim/claim.module';
import { UserGunModule } from 'src/user-gun/user-gun.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameEntity]),
    UserModule,
    ClaimModule,
    UserGunModule,
  ],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
