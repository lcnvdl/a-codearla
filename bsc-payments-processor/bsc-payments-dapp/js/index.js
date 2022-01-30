$(async function () {
  var btnConnect = $("#connect-wallet");
  var btnSubmit = $("button[type='submit']");
  var formMain = $("#form-main");
  var amountInput = $("#amount");
  var currentNetworkTitle = $("#current-network");

  var provider = null;
  var blockchainInfo = null;

  var blockchains = {
    56: {
      name: "Binance Smart Chain",
      usdt: "0x55d398326f99059fF775485246999027B3197955"
    },
    97: {
      name: "Binance Smart Chain TESTNET",
      usdt: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd"
    }
  };

  async function fillBlockchainInfoFromProvider() {
    var result = await requestAccount(provider);
    blockchainInfo = result;

    if (blockchainInfo && blockchainInfo.account) {
      btnSubmit.removeClass("disabled");
      currentNetworkTitle.text(`Current network: ${blockchains[blockchainInfo.networkId].name}`);
    }
  }

  btnConnect.on("click", async function (e) {
    e.preventDefault();

    if (btnConnect.hasClass("disabled")) {
      return;
    }

    btnConnect.addClass("disabled");

    try {
      provider = await connectProvider(false);
      if (provider) {
        await fillBlockchainInfoFromProvider();
      }
    }
    catch (err) {
      btnConnect.removeClass("disabled");
      console.error({ error: err });
    }
  });

  formMain.on("submit", async function (e) {
    e.preventDefault();

    if (btnSubmit.hasClass("disabled")) {
      return;
    }

    var web3 = blockchainInfo.web3;
    var account = blockchainInfo.account;
    var usdtAddress = blockchains[blockchainInfo.networkId].usdt;

    var targetWallet = "0x0B7bDC8Df755EdCD745F6da6ac7334B509b48D56";
    var amount = amountInput.val();

    try {
      btnSubmit.addClass("disabled");

      console.log(`Transfer ${amount} USDT (${usdtAddress}) to ${targetWallet}`);

      var result = await transferToken(web3, account, targetWallet, usdtAddress, window.usdtABI, amount);

      console.log({ result });
    }
    catch (err) {
      console.error({ error: err });
    }
    finally {
      btnSubmit.removeClass("disabled");
    }
  });

  if (location.search === "?autoconnect=true") {
    try {
      btnConnect.addClass("disabled");

      provider = await connectProvider(false);
      if (provider) {
        await fillBlockchainInfoFromProvider();
      }
    }
    catch (err) {
      btnConnect.removeClass("disabled");
      console.error({ error: err });
    }
  }
});