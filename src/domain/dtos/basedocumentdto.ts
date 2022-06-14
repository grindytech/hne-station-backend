import { ApiProperty } from '@nestjs/swagger';

export class BaseDocumentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt?: Date | null;

  @ApiProperty()
  version: number;
}
