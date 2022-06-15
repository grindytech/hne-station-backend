import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class BasicUserDto {
  @AutoMap()
  @ApiProperty()
  address: string;

  @AutoMap()
  @ApiProperty()
  username: string;

  @AutoMap()
  @ApiProperty()
  avatar: string;
}
