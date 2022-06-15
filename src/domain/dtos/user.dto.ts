import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../models/enum';
import { BaseDocumentDto } from './basedocumentdto';

export class UserDto extends BaseDocumentDto {
  @ApiProperty()
  @AutoMap()
  email: string;

  @ApiProperty()
  @AutoMap()
  emailVerified: boolean;

  @ApiProperty()
  @AutoMap()
  address: string;

  @ApiProperty()
  @AutoMap()
  username: string;

  @ApiProperty()
  @AutoMap()
  avatar: string;

  @ApiProperty()
  @AutoMap()
  cover: string;

  @ApiProperty()
  @AutoMap()
  nonce: number;

  @ApiProperty()
  @AutoMap()
  bio: string;

  @ApiProperty()
  @AutoMap()
  playerId: string;

  @ApiProperty()
  @AutoMap()
  roles: Role[];
}
