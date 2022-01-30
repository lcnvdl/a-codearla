$(function () {
  var isAutoconnecting = false;

  function reload() {
    if (!isAutoconnecting && !location.search) {
      location.href = location.href + "?autoconnect=true";
    }
    else {
      location.reload();
    }
  }

  async function connectProvider(autoConnecting) {
    isAutoconnecting = autoConnecting;

    var provider = await detectEthereumProvider({ timeout: 15000 });

    provider.on('chainChanged', function () {
      reload();
    });

    provider.on('accountsChanged', function () {
      reload();
    });

    provider.on('disconnect', function () {
      reload();
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