import { Context, dependency, Get, HttpResponseOK } from '@foal/core';
import { PaymentsProcessor } from '../services/payments-processor.service';

export class ApiController {
  @dependency
  private processor: PaymentsProcessor;

  @Get('/')
  async index(ctx: Context) {
    const transactions = await this.processor.listTransactions();
    return new HttpResponseOK({ transactions });
  }
}
