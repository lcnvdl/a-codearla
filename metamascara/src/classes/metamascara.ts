import { blockchains } from "../constants/blockchains";

export class MetaMascara {
  private accounts: string[] | null = null;
  private selectedAccount: string | null = null;
  private web3: any = null;
  private provider: any = null;
  private _networkId = 0;

  constructor(private web3Factory: (provider: any) => any, private detectEthereumProvider: () => Promise<any>) {
    if (!this.web3Factory || !this.detectEthereumProvider) {
      throw new Error('web3Factory and detectEthereumProvider are required');
    }
  }

  get isConnected() {
    return !!this.selectedAccount;
  }

  get address(): string | null {
    return this.selectedAccount;
  }

  get networkId(): number {
    return this._networkId;
  }

  get networkName(): string {
    const info = blockchains[this._networkId];
    if (!info) {
      return "Unknown";
    }

    return info.name;
  }

  async connect() {
    const provider = await this.connectProvider();
    if (!provider) {
      return false;
    }

    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      return false;
    }

    this.provider = provider;
    this.web3 = this.web3Factory(provider);
    this._networkId = await this.web3.eth.net.getId();
    this.accounts = accounts;
    this.selectedAccount = accounts[0];

    return true;
  }

  private async connectProvider() {
    const provider = await this.detectEthereumProvider();

    provider.on('chainChanged', () => {
      this.reload();
    });

    provider.on('accountsChanged', () => {
      this.reload();
    });

    provider.on('disconnect', () => {
      this.reload();
    });

    return provider;
  }

  private reload() {
    location.reload();
  }
}