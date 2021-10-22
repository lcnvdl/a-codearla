import { Context, dependency, Get, HttpResponseOK } from '@foal/core';
import { BscScanApi, Transactions } from '../services';

export class ApiController {
  @dependency
  private bscsanApi: BscScanApi;

  @dependency
  private transactionsService: Transactions;

  @Get('/')
  async index(ctx: Context) {
    const transactions = await this.bscsanApi.listTransactions();
    return new HttpResponseOK({ transactions });
  }

  @Get('/procesar')
  async procesarTransacciones(ctx: Context) {
    const transactions = await this.bscsanApi.listTransactions();
    this.transactionsService.processTransactions(transactions);
    return new HttpResponseOK({ transactions });
  }
}
