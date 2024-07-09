import { Module, forwardRef } from '@nestjs/common';
import { UserGunService } from './user-gun.service';
import { UserGunController } from './user-gun.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGunEntity } from './user-gun.entity';
import { UserModule } from 'src/user/user.module';
import { GunModule } from 'src/gun/gun.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserGunEntity]),
    GunModule,
    forwardRef(() => UserModule),
  ],
  controllers: [UserGunController],
  providers: [UserGunService],
  exports: [UserGunService],
})
export class UserGunModule {}
