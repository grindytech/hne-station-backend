import { ApiProperty } from '@nestjs/swagger';

export class SelectListItemDto {
  @ApiProperty()
  value: string;

  @ApiProperty()
  label: string;

  extra: any;
}
