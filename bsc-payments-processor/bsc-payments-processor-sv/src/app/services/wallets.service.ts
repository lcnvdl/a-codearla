import { Wallet } from '../entities';

export class Wallets {
  async findWallet(address: string) {
    const wallet = await Wallet.createQueryBuilder('w')
      .where('LOWER(w.id) = :address', { address })
      .getOne();

    return wallet || null;
  }

  async getOrCreateWallet(id: string) {
    let wallet = await this.findWallet(id);

    if (!wallet) {
      wallet = Wallet.create({ id, balance: 0 });
      await wallet.save();
    }

    return wallet;
  }
}
