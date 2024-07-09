import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { ReferralModule } from 'src/referral/referral.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserMissionModule } from 'src/user-mission/user-mission.module';
import { UserGunModule } from 'src/user-gun/user-gun.module';
import { UserBoostModule } from 'src/user-boost/user-boost.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('auth.jwtSecret'),
          signOptions: {
            expiresIn: configService.get<string | number>('auth.jwtExpires'),
          },
        };
      },
    }),
    UserModule,
    ReferralModule,
    UserMissionModule,
    UserGunModule,
    UserBoostModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, JwtStrategy, AuthService],
})
export class AuthModule {}
