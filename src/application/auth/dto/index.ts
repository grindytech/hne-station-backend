import { ApiProperty } from '@nestjs/swagger';
export class GetNonceDto {
  @ApiProperty({ required: true })
  address: string;
}

export class GetTokenDto {
  @ApiProperty({ required: true })
  address: string;
  @ApiProperty({ required: true })
  signature: string;
}

export class CreateAuthenticationBlacklistDto {
  @ApiProperty({ required: true })
  address: string;
}
