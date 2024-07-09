import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { UserModule } from './user/user.module';
import { ReferralModule } from './referral/referral.module';
import { ClaimModule } from './claim/claim.module';
import { MissionModule } from './mission/mission.module';
import { GameModule } from './game/game.module';
import { GunModule } from './gun/gun.module';
import { TelegramModule } from './telegram/telegram.module';
import { UserGunModule } from './user-gun/user-gun.module';
import { UserMissionModule } from './user-mission/user-mission.module';
import { BoostModule } from './boost/boost.module';
import { UserBoostModule } from './user-boost/user-boost.module';
import botConfig from './config/bot.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, botConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    AuthModule,
    UserModule,
    ReferralModule,
    ClaimModule,
    MissionModule,
    GameModule,
    GunModule,
    TelegramModule,
    UserGunModule,
    UserMissionModule,
    BoostModule,
    UserBoostModule,
  ],
})
export class AppModule {}
