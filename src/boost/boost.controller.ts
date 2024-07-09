import { Controller } from '@nestjs/common';
import { BoostService } from './boost.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Boost')
@Controller({
  path: 'boost',
  version: '1',
})
export class BoostController {
  constructor(private readonly boostService: BoostService) {}
}
