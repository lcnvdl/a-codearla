import { ReceivingWallet } from '../entities/receiving-wallet.entity';

export class ReceivingWallets {
  async getOrCreateWallet(address: string) {
    let wallet = await ReceivingWallet.findOne({ id: address });

    if (!wallet) {
      wallet = ReceivingWallet.create({ id: address, lastBlock: '0' });
      await wallet.save();
      console.log('New ReceivingWallet created');
    }

    return wallet;
  }
}
