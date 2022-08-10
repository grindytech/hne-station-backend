import { Injectable } from '@nestjs/common';
import * as ethSigUtil from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-utils';
import Web3 from 'web3';
import AppConfiguration from '../../config/configuration';
import { contract_he } from './contract';

@Injectable()
export class Web3Service {
  private getWeb3 = () => new Web3(AppConfiguration().web3.httpUrl);
  async blockNumber() {
    return await this.getWeb3().eth.getBlockNumber();
  }

  async getLatestBlock(verbose = false) {
    return await this.getWeb3().eth.getBlock('latest', verbose);
  }

  async getBlock(blockHashOrBlockNumber, verbose = true) {
    return await this.getWeb3().eth.getBlock(blockHashOrBlockNumber, verbose);
  }

  async getTransaction(trxHash) {
    return await this.getWeb3().eth.getTransaction(trxHash);
  }

  async getTransactionReceipt(trxHash) {
    return await this.getWeb3().eth.getTransactionReceipt(trxHash);
  }

  async estimateGas(txObj) {
    return this.getWeb3().eth.estimateGas(txObj);
  }

  async getGasPrice() {
    return await this.getWeb3().eth.getGasPrice();
  }

  checkSignature({
    hashMessage,
    address,
    signedSignature,
  }: {
    hashMessage: string;
    address: string;
    signedSignature: string;
  }): boolean {
    console.log(`hash message: ${hashMessage}`);
    const msgBufferHex = bufferToHex(hashMessage);
    console.log(msgBufferHex);
    const recoveredAddress = ethSigUtil.recoverPersonalSignature({
      data: msgBufferHex,
      sig: signedSignature,
    });
    console.log(`recovered address: ${recoveredAddress}`);
    return address.toLowerCase() === recoveredAddress.toLowerCase();
  }

  replaceLastByteLedger(signature: string) {
    const lastByte = signature.slice(signature.length - 2, signature.length);
    let replaceV;
    if (lastByte === '00') {
      replaceV = '1b';
    }
    if (lastByte === '01') {
      replaceV = '1c';
    }
    if (replaceV) {
      signature = signature.slice(0, signature.length - 2) + replaceV;
    }
    return signature;
  }

  async getHEBalance(address: string): Promise<number> {
    const balance = await contract_he(this.getWeb3())
      .methods.balanceOf(address)
      .call();
    return Number(Web3.utils.fromWei(String(balance)));
  }

  async getHEBurned(): Promise<number> {
    const balance = await contract_he(this.getWeb3())
      .methods.balanceOf('0x000000000000000000000000000000000000dead')
      .call();
    return Number(Web3.utils.fromWei(String(balance)));
  }
}
