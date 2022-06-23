import { mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { Injectable } from '@nestjs/common';
import 'reflect-metadata';
import { ProposalDto } from '../dtos/proposal.dto';
import { Proposal } from '../models';

@Injectable()
export class ProposalMapper extends AutomapperProfile {
  constructor(@InjectMapper('') mapper: Mapper) {
    super(mapper);
  }
  mapProfile() {
    return (mapper) => {
      mapper
        .createMap(Proposal, ProposalDto)
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
          (des) => des.amount,
          mapFrom((src) => src.amount),
        )
        .forMember(
          (des) => des.userAddress,
          mapFrom((src) => src.userAddress),
        );
    };
  }
}
