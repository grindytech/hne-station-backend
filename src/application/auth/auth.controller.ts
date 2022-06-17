import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { iInfoToken } from 'src/config/requestcontext';
import { BaseResult, UserDto } from 'src/domain/dtos';
import { AuthService } from './auth.service';
import { GetNonceDto, GetTokenDto, TokenLoginDto } from './dto';
import { XApiKeyGuard } from './header-x-api-key.guard';

@Controller('authentication')
@ApiTags('Authentication')
@ApiExtraModels(UserDto, TokenLoginDto, iInfoToken, BaseResult)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('nonce')
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(UserDto),
            },
          },
        },
      ],
    },
  })
  async getNonce(@Query() query: GetNonceDto): Promise<BaseResult<UserDto>> {
    const user = await this.authService.getUserByAddress(query.address);
    const rs = new BaseResult<UserDto>();
    rs.data = user;
    return rs;
  }

  @Post('token')
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: {
              properties: {
                accessToken: { type: 'string' },
              },
            },
          },
        },
      ],
    },
  })
  async getToken(@Body() tokenDto: GetTokenDto): Promise<any> {
    const accessToken = await this.authService.generateToken(tokenDto);
    const rs = new BaseResult<string>();
    rs.data = accessToken;
    return rs;
  }
  @Post('token/decode')
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(iInfoToken),
            },
          },
        },
      ],
    },
  })
  async getTokenDecode(
    @Body() jwt: TokenLoginDto,
  ): Promise<BaseResult<iInfoToken>> {
    const info = await this.authService.jwtDecode(jwt.token);
    const rs = new BaseResult<iInfoToken>();
    rs.data = info;
    return rs;
  }
  @Post('/token/login')
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(UserDto),
            },
          },
        },
      ],
    },
  })
  async tokenLogin(@Body() jwt: TokenLoginDto): Promise<BaseResult<UserDto>> {
    const user = await this.authService.tokenLogin(jwt.token);
    const rs = new BaseResult<UserDto>();
    rs.data = user;
    return rs;
  }

  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('JWT')
  @UseGuards(XApiKeyGuard)
  @ApiHeader({
    name: 'x-api-key',
    description: 'x-api-key',
  })
  @Post(':address/blacklist')
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: {
              type: 'string',
            },
          },
        },
      ],
    },
  })
  async createAuthenticationBlacklist(
    @Param('address') address: string,
  ): Promise<BaseResult<string>> {
    const rs = new BaseResult<string>();
    const id = await this.authService.createBlackList(address);
    rs.data = id;
    return rs;
  }

  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('JWT')
  @UseGuards(XApiKeyGuard)
  @ApiHeader({
    name: 'x-api-key',
    description: 'x-api-key',
  })
  @Delete(':address/blacklist')
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: {
              type: 'string',
            },
          },
        },
      ],
    },
  })
  async removeAuthenticationBlackList(
    @Param('address') address: string,
  ): Promise<BaseResult<string>> {
    const rs = new BaseResult<string>();
    const id = await this.authService.removeBlackList(address);
    rs.data = id;
    return rs;
  }
}
