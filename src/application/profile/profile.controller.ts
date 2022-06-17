import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Request,
  Response,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { BaseResult, UserDto } from 'src/domain/dtos';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';
@Controller()
@ApiTags('Profile')
@ApiExtraModels(UserDto, BaseResult)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('profile/:address')
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: { $ref: getSchemaPath(UserDto) },
          },
        },
      ],
    },
  })
  async getProfileByAddress(@Param('address') address: string) {
    const rs = new BaseResult<UserDto>();
    const user = await this.profileService.getProfileByAddress(address);
    rs.data = user;
    return rs;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: { $ref: getSchemaPath(UserDto) },
          },
        },
      ],
    },
  })
  @Get('profile')
  async getProfile(@Request() req, @Response() res) {
    const rs = new BaseResult<UserDto>();
    rs.data = await this.profileService.toUserDto(req.user);
    return res.status(HttpStatus.OK).json(rs);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: { $ref: getSchemaPath(UserDto) },
          },
        },
      ],
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResult) },
        {
          properties: {
            data: { $ref: getSchemaPath(UserDto) },
          },
        },
      ],
    },
  })
  async updateProfile(
    @Request() req,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      cover?: Express.Multer.File[];
    },

    @Body() body: UserDto,
    @Response() res,
  ) {
    const avatar = files.avatar ? files.avatar[0] : null;
    const cover = files.cover ? files.cover[0] : null;
    const { username, bio, playerId, email } = body;
    const { address } = req.user;
    const newUser = await this.profileService.updateProfile({
      avatar,
      cover,
      username,
      bio,
      playerId,
      email,
      address,
    });
    const rs = new BaseResult<UserDto>();
    rs.data = newUser;
    return res.status(HttpStatus.OK).json(rs);
  }
}
