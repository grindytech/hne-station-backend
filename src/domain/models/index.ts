import { BlackList } from './blacklist.model';
import { Deposit } from './deposit.model';
import { Proposal } from './proposal.model';
import { User } from './user.model';
import { Vote } from './votes.model';

export * from './blacklist.model';
export * from './deposit.model';
export * from './proposal.model';
export * from './user.model';
export * from './votes.model';

export const models = [User, BlackList, Proposal, Deposit, Vote];
export const modelsReferences = () => {
  Proposal.hasMany(Deposit, { foreignKey: 'proposalID' });
  Proposal.hasMany(Vote, { foreignKey: 'proposalID' });
};
