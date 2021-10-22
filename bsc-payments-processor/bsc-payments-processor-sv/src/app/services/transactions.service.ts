import { dependency } from '@foal/core';
import { Currency, Wallet } from '../entities';
import { Transaction } from '../entities/transaction.entity';
import { IBscScanTransaction } from '../interfaces/bscscan-transaction.interface';
import { BigNumber } from 'bignumber.js';
import { Wallets } from './wallets.service';
import { getConnection, QueryRunner } from 'typeorm';

export class Transactions {
  @dependency
  private wallets: Wallets;

  async processTransactions(apiTransactions: IBscScanTransaction[]) {
    const currencies = await Currency.find();

    for (const apiTransaction of apiTransactions) {
      const transactionId = `rv-${apiTransaction.hash}`;
      const exists = await Transaction.findOne({ id: transactionId });

      if (!exists) {
        const currency = currencies.find(m => m.contract.toLowerCase() == apiTransaction.contractAddress.toLowerCase());

        if (currency) {
          await this.saveTransactionAndUpdateWalletBalance(transactionId, apiTransaction, currency);
        }
      }
      else {
        console.log('Transaction already exists', { transactionId });
      }
    }
  }

  private async saveTransactionAndUpdateWalletBalance(transactionId: string, apiTransaction: IBscScanTransaction, currency: Currency) {
    const wallet = await this.wallets.getOrCreateWallet(apiTransaction.from);

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = this.createTransactionEntity(queryRunner, transactionId, apiTransaction, currency, wallet);

      await queryRunner.manager.createQueryBuilder()
        .update(Wallet)
        .set({ balance: () => `balance + ${transaction.amount}` })
        .where({ id: wallet.id })
        .execute();
      console.log('Wallet saved', wallet.id);

      await queryRunner.manager.save(transaction);
      console.log('Transaction saved', transaction.id);

      await queryRunner.commitTransaction();
    }
    catch (err) {
      console.log('Rollback!');
      await queryRunner.rollbackTransaction();
      throw err;
    }
    finally {
      await queryRunner.release();
    }
  }

  private createTransactionEntity(queryRunner: QueryRunner, id: string, apiTransaction: IBscScanTransaction, currency: Currency, wallet: Wallet) {
    const transaction = queryRunner.manager.create<Transaction>(Transaction);
    transaction.id = id;
    transaction.date = new Date(apiTransaction.timeStamp * 1000);
    transaction.description = '';
    transaction.from = apiTransaction.from;
    transaction.to = apiTransaction.to;
    transaction.currency = currency;
    transaction.wallet = wallet;

    const amount = new BigNumber(apiTransaction.value).div(new BigNumber(10).pow(currency.decimals));
    transaction.amount = amount.toNumber();

    return transaction;
  }
}
