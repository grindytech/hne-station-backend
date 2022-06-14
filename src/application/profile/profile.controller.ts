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
import { User } from '../../domain/models/user.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';
@Controller()
@ApiTags('Profile')
@ApiExtraModels(User)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('profile/:address')
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            success: { type: 'boolean' },
            data: { $ref: getSchemaPath(User) },
            errors: { type: 'object' },
          },
        },
      ],
    },
  })
  async getProfileByAddress(@Param('address') address: string) {
    const user = await this.profileService.getProfileByAddress(address);
    return { success: true, errors: [], data: user };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'string',
            },
            errors: { type: 'object' },
          },
        },
      ],
    },
  })
  @Get('profile')
  getProfile(@Request() req, @Response() res) {
    return res
      .status(HttpStatus.OK)
      .json({ data: req.user, success: true, errors: [] });
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            success: { type: 'boolean' },
            data: { $ref: getSchemaPath(User) },
            errors: { type: 'object' },
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
      type: 'object',
      properties: {
        username: { type: 'string' },
        bio: { type: 'string' },
        playerId: { type: 'string' },
        email: { type: 'string' },
        address: { type: 'string' },
        avatar: {
          type: 'string',
          format: 'binary',
        },
        cover: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async updateProfile(
    @Request() req,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      cover?: Express.Multer.File[];
    },

    @Body() body,
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
    return res
      .status(HttpStatus.OK)
      .json({ data: newUser, status: true, errors: [] });
  }
}
