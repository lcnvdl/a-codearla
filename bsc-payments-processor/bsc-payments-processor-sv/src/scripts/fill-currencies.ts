// 3p
import { createConnection } from 'typeorm';
import { Currency } from '../app/entities/currency.entity';

const currencies = [
  {
    name: 'BUSD Token',
    symbol: 'BUSD',
    decimals: 18,
    contract: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    url: 'https://bscscan.com/token/0xe9e7cea3dedca5984780bafc599bd69add087d56'
  },
  {
    name: 'BSC-USD',
    symbol: 'USDT',
    decimals: 18,
    contract: '0x55d398326f99059ff775485246999027b3197955',
    url: 'https://bscscan.com/token/0x55d398326f99059ff775485246999027b3197955'
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 18,
    contract: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    url: 'https://bscscan.com/token/0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d'
  },
  {
    name: 'Dai Token',
    symbol: 'DAI',
    decimals: 18,
    contract: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
    url: 'https://bscscan.com/token/0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3'
  },
];

export async function main(args: any) {
  const connection = await createConnection();

  try {
    for (const data of currencies) {
      const exists = await Currency.findOne({ contract: data.contract });
      if (!exists) {
        const newCurrency = Currency.create(data);
        await newCurrency.save();
        console.log('Currency created', data);
      }
      else {
        console.log(`Currency "${data.name}" already exists."`);
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    await connection.close();
  }
}
