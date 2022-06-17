import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';
import { Inject, Injectable } from '@nestjs/common';
import { BaseResultPagination, PaginationDto } from 'src/domain/dtos';
import { ProposalDto } from 'src/domain/dtos/proposal.dto';
import { Proposal } from 'src/domain/models';
import { GetProposalsDto } from './dtos';

@Injectable()
export class ProposalService {
  constructor(
    @Inject(Proposal.name)
    private readonly proposalModel: typeof Proposal,
    @InjectMapper('')
    private readonly mapper: Mapper,
  ) {}

  async getProposals(
    query: GetProposalsDto,
  ): Promise<BaseResultPagination<ProposalDto>> {
    const where: any = {};
    if (query.proposer) {
      where.proposer = query.proposer;
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.proposalId) {
      where.proposalId = query.proposalId;
    }
    const { rows, count } = await this.proposalModel.findAndCountAll({
      where,
      limit: query.size,
      offset: query.skipIndex,
    });
    const rs = new BaseResultPagination<ProposalDto>();
    const proposals = await this.mapper.mapArrayAsync(
      rows,
      ProposalDto,
      Proposal,
    );
    const data = new PaginationDto<ProposalDto>(
      proposals,
      count,
      query.page,
      query.size,
    );
    rs.data = data;
    return rs;
  }
}
