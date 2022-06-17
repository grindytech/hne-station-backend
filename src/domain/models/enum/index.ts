export enum MediaType {
  Image = 10,
  Video = 20,
  Audio = 30,
}

export enum ViewType {
  Public = 1,
  Private = 0,
}

export enum BlacklistType {
  Yellow = 1,
  Red = 2,
}

export enum Role {
  Admin = 'admin',
  User = 'user',
}

export enum ProposalStatus {
  Init = 1,
  Reject = 2,
  Deposit = 3,
  DepositNotEnough = 4,
  Voting = 5,
  Passed = 6,
  Failed = 7,
  Veto = 8,
}

export enum VoteType {
  Pass = 1,
  Fail = 2,
  Veto = 3,
}
