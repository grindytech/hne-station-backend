import { mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { Injectable } from '@nestjs/common';
import 'reflect-metadata';
import { DepositDto } from '../dtos/deposit.dto';
import { Deposit } from '../models';

@Injectable()
export class DepositMapper extends AutomapperProfile {
  constructor(@InjectMapper('') mapper: Mapper) {
    super(mapper);
  }
  mapProfile() {
    return (mapper) => {
      mapper
        .createMap(Deposit, DepositDto)
        .forMember(
          (des) => des.id,
          mapFrom((src) => src.id),
        )
        .forMember(
          (des) => des.createdAt,
          mapFrom((src) => src.createdAt),
        )
        .forMember(
          (des) => des.updatedAt,
          mapFrom((src) => src.updatedAt),
        );
    };
  }
}
