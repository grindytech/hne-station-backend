import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import sequelize, { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { BaseResultPagination, PaginationDto, VoteDto } from 'src/domain/dtos';
import { DepositDto } from 'src/domain/dtos/deposit.dto';
import { ProposalDto } from 'src/domain/dtos/proposal.dto';
import { Deposit, Proposal, Vote } from 'src/domain/models';
import { GetDepositsDto, GetProposalsDto, GetVotesDto } from './dtos';

@Injectable()
export class ProposalService {
  constructor(
    @Inject(Proposal.name)
    private readonly proposalModel: typeof Proposal,
    @Inject(Deposit.name)
    private readonly depositModel: typeof Deposit,
    @Inject(Vote.name)
    private readonly voteModel: typeof Vote,
    @Inject('SEQUELIZE')
    private readonly database: Sequelize,
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
      order: [query.sort],
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

  async getDeposits(
    query: GetDepositsDto,
  ): Promise<BaseResultPagination<DepositDto>> {
    const where: any = {};
    if (query.proposalId) {
      where.proposalId = query.proposalId;
    }
    if (query.userAddress) {
      where.userAddress = query.userAddress;
    }
    const { rows, count } = await this.depositModel.findAndCountAll({
      where,
      limit: query.size,
      offset: query.skipIndex,
      order: [query.sort],
    });
    const rs = new BaseResultPagination<DepositDto>();
    const deposits = await this.mapper.mapArrayAsync(rows, DepositDto, Deposit);
    const data = new PaginationDto<DepositDto>(
      deposits,
      count,
      query.page,
      query.size,
    );
    rs.data = data;
    return rs;
  }

  async getDepositors(
    query: GetDepositsDto,
  ): Promise<BaseResultPagination<DepositDto>> {
    if (!query.proposalId) throw new BadRequestException('Require proposalId');

    const where: any = {};
    if (query.proposalId) {
      where.proposalId = query.proposalId;
    }

    const count = await this.database.query(
      `SELECT  count(*) as total from (SELECT * from deposits where proposalID='${query.proposalId}' group by userAddress) t`,
      { type: QueryTypes.SELECT },
    );

    const deposits = await this.depositModel.findAll({
      attributes: [
        'proposalId',
        'userAddress',
        [sequelize.fn('SUM', sequelize.col('amount')), 'amount'],
      ],
      where,
      limit: query.size,
      offset: query.skipIndex,
      group: ['proposalId', 'userAddress'],
      order: [['amount', 'desc']],
    });

    const rs = new BaseResultPagination<DepositDto>();
    const depositsDto = await this.mapper.mapArrayAsync(
      deposits,
      DepositDto,
      Deposit,
    );

    const data = new PaginationDto<DepositDto>(
      depositsDto,
      Number(count[0]['total']),
      query.page,
      query.size,
    );
    rs.data = data;
    return rs;
  }

  async getVotes(query: GetVotesDto): Promise<BaseResultPagination<VoteDto>> {
    const where: any = {};
    if (query.proposalId) {
      where.proposalId = query.proposalId;
    }
    if (query.userAddress) {
      where.userAddress = query.userAddress;
    }
    if (query.type) {
      where.type = query.type;
    }
    const { rows, count } = await this.voteModel.findAndCountAll({
      where,
      limit: query.size,
      offset: query.skipIndex,
      order: [query.sort],
    });
    const rs = new BaseResultPagination<VoteDto>();
    const deposits = await this.mapper.mapArrayAsync(rows, VoteDto, Vote);
    const data = new PaginationDto<VoteDto>(
      deposits,
      count,
      query.page,
      query.size,
    );
    rs.data = data;
    return rs;
  }

  async getVoters(query: GetVotesDto): Promise<BaseResultPagination<VoteDto>> {
    if (!query.proposalId) throw new BadRequestException('Require proposalId');

    const count = await this.database.query(
      `SELECT  count(*) as total from (SELECT * from votes 
        where proposalID = '${query.proposalId}' 
        and type = '${query.type}'
        group by userAddress) t`,
      { type: QueryTypes.SELECT },
    );
    const where: any = {};
    if (query.proposalId) {
      where.proposalId = query.proposalId;
    }
    if (query.type) {
      where.type = query.type;
    }
    const votes = await this.voteModel.findAll({
      attributes: [
        'proposalId',
        'userAddress',
        'type',
        [sequelize.fn('SUM', sequelize.col('amount')), 'amount'],
      ],
      where,
      limit: query.size,
      offset: query.skipIndex,
      group: ['proposalId', 'userAddress', 'type'],
      order: [['amount', 'desc']],
    });

    const rs = new BaseResultPagination<VoteDto>();
    const votesDto = await this.mapper.mapArrayAsync(votes, VoteDto, Vote);

    const data = new PaginationDto<VoteDto>(
      votesDto,
      Number(count[0]['total']),
      query.page,
      query.size,
    );
    rs.data = data;
    return rs;
  }
}
