import { Context, dependency, Env, Get, HttpResponseOK } from '@foal/core';
import { BscScanApi, ReceivingWallets, Transactions } from '../services';
import { BigNumber } from 'bignumber.js';

export class ApiController {
  @dependency
  private bscsanApi: BscScanApi;

  @dependency
  private transactionsService: Transactions;

  @dependency
  private receivingWallets: ReceivingWallets;

  @Get('/')
  async index(ctx: Context) {
    const transactions = await this.bscsanApi.listTransactions();
    return new HttpResponseOK({ transactions });
  }

  @Get('/primerBloque')
  async obtenerPrimerBloque(ctx: Context) {
    const bloque = await this.bscsanApi.getFirstBlock();
    return new HttpResponseOK({ bloque });
  }

  @Get('/procesar')
  async procesarTransacciones(ctx: Context) {
    const mainWallet = await this.receivingWallets.getOrCreateWallet(Env.get('WALLET') as string);
    if (mainWallet.lastBlock === '0') {
      mainWallet.lastBlock = await this.bscsanApi.getFirstBlock();
      await mainWallet.save();
      console.log('New \'Last Block\'', mainWallet.lastBlock);
    }

    const previousBlock = new BigNumber(mainWallet.lastBlock).minus(1);

    const transactions = await this.bscsanApi.listTransactions(previousBlock.toString());

    if (transactions.length > 0) {
      this.transactionsService.processTransactions(transactions);

      let maxBlock = new BigNumber(transactions[0].blockNumber);

      for(let i = 1; i < transactions.length; i++) {
        const block = new BigNumber(transactions[i].blockNumber);
        if (block.gt(maxBlock)) {
          maxBlock = block;
        }
      }

      mainWallet.lastBlock = maxBlock.toString();
      await mainWallet.save();

      console.log('New \'Last Block\'', mainWallet.lastBlock);
    }

    return new HttpResponseOK({ transactions });
  }
}
