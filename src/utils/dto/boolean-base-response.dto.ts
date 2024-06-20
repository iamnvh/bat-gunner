import { BaseResponseDto } from 'src/utils/dto/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BooleanResponseDto extends BaseResponseDto<boolean> {
  @ApiProperty({ type: () => Boolean })
  data: boolean;
}
