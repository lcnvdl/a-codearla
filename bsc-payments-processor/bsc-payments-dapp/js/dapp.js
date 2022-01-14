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

  window.connectProvider = connectProvider;
  window.requestAccount = requestAccount;
});