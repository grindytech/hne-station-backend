import { ApiProperty } from '@nestjs/swagger';

export class BaseResult<T> {
  @ApiProperty()
  errors: object;
  @ApiProperty()
  data: T;
  @ApiProperty()
  success = true;
}
