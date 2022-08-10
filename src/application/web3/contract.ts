import configuration from 'src/config/configuration';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { default as heAbi } from './abi/HeToken.abi.json';

export const contract_he = (web3: Web3) =>
  new web3.eth.Contract(
    heAbi as AbiItem[],
    configuration().contracts.heContract,
  );
