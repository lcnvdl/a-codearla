import { dependency } from '@foal/core';
import { BscScanApi } from './bsc-scan-api.service';
import { ReceivingWallets } from './receiving-wallets.service';
import { Transactions } from './transactions.service';
import { BigNumber } from 'bignumber.js';
import { IBscScanTransaction } from '../interfaces/bscscan-transaction.interface';

export class PaymentsProcessor {
  @dependency
  private bscsanApi: BscScanApi;

  @dependency
  private transactionsService: Transactions;

  @dependency
  private receivingWallets: ReceivingWallets;

  async listTransactions() {
    const transactions = await this.bscsanApi.listTransactions();
    return transactions;
  }

  async processTransactions(address: string) {
    const mainWallet = await this.getMainWallet(address);

    const previousBlock = new BigNumber(mainWallet.lastBlock).minus(1);

    const transactions = await this.bscsanApi.listTransactions(previousBlock.toString());

    if (transactions.length > 0) {
      this.transactionsService.processTransactions(transactions);

      const maxBlock = this.getMaxBlock(transactions).toString();

      if(mainWallet.lastBlock !== maxBlock) {
        mainWallet.lastBlock = maxBlock;
        await mainWallet.save();

        console.log('New \'Last Block\'', mainWallet.lastBlock);
      }
    }

    return transactions;
  }

  private getMaxBlock(transactions: IBscScanTransaction[]) {
    let maxBlock = new BigNumber(transactions[0].blockNumber);

    for (let i = 1; i < transactions.length; i++) {
      const block = new BigNumber(transactions[i].blockNumber);
      if (block.gt(maxBlock)) {
        maxBlock = block;
      }
    }

    return maxBlock;
  }

  private async getMainWallet(address: string) {
    const mainWallet = await this.receivingWallets.getOrCreateWallet(address);

    if (mainWallet.lastBlock === '0') {
      mainWallet.lastBlock = await this.bscsanApi.getFirstBlock();
      await mainWallet.save();
      console.log('New \'Last Block\'', mainWallet.lastBlock);
    }

    return mainWallet;
  }
}
