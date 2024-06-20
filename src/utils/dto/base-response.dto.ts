import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T> {
  @ApiProperty()
  message: string;

  @ApiProperty()
  code: number;

  @ApiProperty({ type: () => Object })
  data?: T;
}
