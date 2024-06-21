import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReferralService } from './referral.service';

@ApiTags('Referral')
@Controller({
  path: 'ref',
  version: '1',
})
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}
}
