import { controller, dependency, Env, IAppController } from '@foal/core';
import { createConnection } from 'typeorm';
import { ApiController } from './controllers';
import { ReceivingWallets } from './services';

export class AppController implements IAppController {
  @dependency
  receivingWallets: ReceivingWallets;

  subControllers = [
    controller('/api', ApiController),
  ];

  async init() {
    await createConnection();

    await this.ensureMainWallet();
  }

  private async ensureMainWallet() {
    const receivingWalletAddress = Env.get('WALLET');
    if (!receivingWalletAddress) {
      throw new Error('Missing main wallet');
    }

    const mainWallet = await this.receivingWallets.getOrCreateWallet(receivingWalletAddress);
    console.log('Main wallet', mainWallet.id.substr(0, 6) + '...');
    console.log('Last block', mainWallet.lastBlock);
  }
}
