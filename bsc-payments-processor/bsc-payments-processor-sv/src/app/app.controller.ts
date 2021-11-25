import { controller, dependency, Env, IAppController } from '@foal/core';
import { createConnection } from 'typeorm';
import { ApiController } from './controllers';
import { ReceivingWallets } from './services';
import { PaymentsProcessor } from './services/payments-processor.service';

export class AppController implements IAppController {
  @dependency
  processor: PaymentsProcessor;

  @dependency
  receivingWallets: ReceivingWallets;

  subControllers = [
    controller('/api', ApiController),
  ];

  private isProcessing = false;

  async init() {
    await createConnection();

    await this.ensureMainWallet();

    this.startPaymentsProcessor();
  }

  private get mainWalletAddress() {
    const receivingWalletAddress = Env.get('WALLET');
    if (!receivingWalletAddress) {
      throw new Error('Missing main wallet');
    }

    return receivingWalletAddress;
  }

  private startPaymentsProcessor() {
    const processInterval = +(Env.get('PROCESS_INTERVAL') as string);

    setInterval(() => {
      if (!this.isProcessing) {
        console.log('Processing transactions...');

        this.processor.processTransactions(this.mainWalletAddress)
          .then(() => console.log('Transactions processed successfully'))
          .catch(err => console.log('Error processing transactions', err))
          .finally(() => this.isProcessing = false);

        this.isProcessing = true;
      }
    }, processInterval * 1000);
  }

  private async ensureMainWallet() {
    const mainWallet = await this.receivingWallets.getOrCreateWallet(this.mainWalletAddress);
    console.log('Main wallet', mainWallet.id.substr(0, 6) + '...');
    console.log('Last block', mainWallet.lastBlock);
  }
}
