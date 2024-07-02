import { Controller } from '@nestjs/common';
import { UserGunService } from './user-gun.service';

@Controller('user-gun')
export class UserGunController {
  constructor(private readonly userGunService: UserGunService) {}
}
