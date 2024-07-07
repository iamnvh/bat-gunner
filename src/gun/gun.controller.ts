import { Controller } from '@nestjs/common';
import { GunService } from './gun.service';

@Controller({ path: 'gun', version: '1' })
export class GunController {
  constructor(private readonly gunService: GunService) {}
}
