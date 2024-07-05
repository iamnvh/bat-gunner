import { Module, forwardRef } from '@nestjs/common';
import { GunService } from './gun.service';
import { GunController } from './gun.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GunEntity } from './gun.entity';
import { UserGunModule } from 'src/user-gun/user-gun.module';
import { UserModule } from 'src/user/user.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([GunEntity]),
    UserModule,
    forwardRef(() => UserGunModule),
  ],
  controllers: [GunController],
  providers: [GunService],
  exports: [GunService],
})
export class GunModule {}
