export interface IBscScanTransaction {
  contractAddress: string;
  from: string;
  to: string;
  timeStamp: number;
  tokenSymbol: string;
  tokenName: string;
  blockNumber: string;
  value: string;
  hash: string;
}
