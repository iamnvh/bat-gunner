import { Controller } from '@nestjs/common';
import { GunService } from './gun.service';

@Controller('gun')
export class GunController {
  constructor(private readonly gunService: GunService) {}
}
