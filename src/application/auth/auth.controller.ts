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
import { AuthService } from './auth.service';
import { GetNonceDto, GetTokenDto } from './dto';
import { XApiKeyGuard } from './header-x-api-key.guard';

@Controller('authentication')
@ApiTags('Authentication')
@ApiExtraModels(iInfoToken)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('nonce')
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            success: { type: 'boolean' },
            data: {
              properties: {
                address: { type: 'string' },
                nonce: { type: 'number' },
              },
            },
            errors: { type: 'object' },
          },
        },
      ],
    },
  })
  async getNonce(@Query() query: GetNonceDto): Promise<any> {
    console.log(query);
    const user = await this.authService.getUserByAddress(query.address);
    return {
      success: true,
      data: { address: query.address, nonce: user.nonce },
      errors: [],
    };
  }

  @Post('token')
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            success: { type: 'boolean' },
            data: {
              properties: {
                accessToken: { type: 'string' },
              },
            },
            errors: { type: 'object' },
          },
        },
      ],
    },
  })
  async getToken(@Body() tokenDto: GetTokenDto): Promise<any> {
    const accessToken = await this.authService.generateToken(tokenDto);
    return {
      success: true,
      data: { accessToken },
      errors: [],
    };
  }
  @Post('token/decode')
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            success: { type: 'boolean' },
            data: {
              $ref: getSchemaPath(iInfoToken),
            },
            errors: { type: 'object' },
          },
        },
      ],
    },
  })
  async getTokenDecode(@Body() jwt: { token: string }): Promise<any> {
    const info = await this.authService.jwtDecode(jwt.token);
    return {
      success: true,
      data: info,
      errors: [],
    };
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
        {
          properties: {
            success: { type: 'boolean' },
            data: { type: 'string' },
            errors: { type: 'object' },
          },
        },
      ],
    },
  })
  async createAuthenticationBlacklist(
    @Param('address') address: string,
  ): Promise<any> {
    const id = await this.authService.createBlackList(address);
    return {
      success: true,
      data: id,
      errors: [],
    };
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
        {
          properties: {
            success: { type: 'boolean' },
            data: { type: 'string' },
            errors: { type: 'object' },
          },
        },
      ],
    },
  })
  async removeAuthenticationBlackList(@Param('address') address: string) {
    const id = await this.authService.removeBlackList(address);
    return {
      success: true,
      data: id,
      errors: [],
    };
  }
}
