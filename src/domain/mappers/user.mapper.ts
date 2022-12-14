import { mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { Injectable } from '@nestjs/common';
import 'reflect-metadata';
import { UserDto } from '../dtos';
import { User } from '../models';

@Injectable()
export class UserMapper extends AutomapperProfile {
  constructor(@InjectMapper('') mapper: Mapper) {
    super(mapper);
  }
  mapProfile() {
    return (mapper) => {
      mapper
        .createMap(User, UserDto)
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
        )
        .forMember(
          (des) => des.roles,
          mapFrom((src) => src.roles?.split(',')),
        );
    };
  }
}
