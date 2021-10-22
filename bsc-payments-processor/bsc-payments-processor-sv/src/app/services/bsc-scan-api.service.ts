import { Env } from '@foal/core';

import * as axios from 'axios';
import { IBscScanResponse } from '../interfaces/bscscan-response.interface';
import { IBscScanTransaction } from '../interfaces/bscscan-transaction.interface';

const apiUrl = 'https://api.bscscan.com/api';

export class BscScanApi {
  private key: string;
  private wallet: string;

  constructor() {
    this.loadSettings();
  }

  async listTransactions(initialBlock = 0) {
    const action = 'module=account&action=tokentx';
    const url = `${apiUrl}?${action}&address=${this.wallet}&startblock=${initialBlock}&endBlock=99999999&sort=desc&apikey=${this.key}`;

    const response = await axios.default.get(url);
    if (response.status !== 200) {
      throw new Error(`Error code ${response.status} - ${response.statusText}`);
    }

    const bscScanResponse = response.data as IBscScanResponse<IBscScanTransaction[]>;
    return bscScanResponse.result;
  }

  private loadSettings() {
    const key = Env.get('BSCSCAN_KEY');
    if (!key) {
      throw new Error('BSCScan Key is undefined');
    }

    this.key = key;

    const wallet = Env.get('WALLET');
    if (!wallet) {
      throw new Error('Wallet is undefined');
    }

    this.wallet = wallet;
  }
}
