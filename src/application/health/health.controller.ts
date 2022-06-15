import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { HealthService } from './health.service';
@Controller('health')
@ApiTags('Health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('readiness')
  @ApiCreatedResponse({
    schema: {
      allOf: [
        {
          properties: {
            status: { type: 'string' },
          },
        },
      ],
    },
  })
  getHealthReadiness(): any {
    return this.healthService.getHealth();
  }

  @Get('liveness')
  @ApiCreatedResponse({
    schema: {
      allOf: [
        {
          properties: {
            status: { type: 'string' },
          },
        },
      ],
    },
  })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  getHealthLiveness(): any {
    return this.healthService.getHealth();
  }
}
