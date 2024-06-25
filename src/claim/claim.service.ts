import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClaimEntity } from './claim.entity';
import { ClaimDto } from './dto/claim.dto';

@Injectable()
export class ClaimService {
  constructor(
    @InjectRepository(ClaimEntity)
    private claimRepository: Repository<ClaimEntity>,
  ) {}

  async create(params: ClaimDto): Promise<ClaimEntity> {
    return this.claimRepository.save(params);
  }
}
