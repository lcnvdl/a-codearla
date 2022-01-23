$(function () {
  async function connectProvider() {
    var provider = await detectEthereumProvider({ timeout: 15000 });

    provider.on('chainChanged', function () {
      location.reload();
    });

    provider.on('accountsChanged', function () {
      location.reload();
    });

    provider.on('disconnect', function () {
      location.reload();
    });

    console.log({ provider });

    return provider;
  }

  async function requestAccount(provider) {
    var accounts = await provider.request({ method: 'eth_requestAccounts' });
    var web3 = new Web3(provider);

    var result = {
      web3,
      account: accounts[0],
      networkId: await web3.eth.net.getId(),
    };

    return result;
  }

  async function transferToken(web3, account, targetWallet, usdtAddress, usdtABI, amount) {
    var contract = new web3.eth.Contract(usdtABI, usdtAddress);

    // var balance = await contract.methods.balanceOf(account).call();
    // console.log({ balance });

    var bn = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(18));
    var result = await contract.methods.transfer(targetWallet, bn.toString()).send({ from: account });

    return result;
  }

  window.connectProvider = connectProvider;
  window.requestAccount = requestAccount;
  window.transferToken = transferToken;
});