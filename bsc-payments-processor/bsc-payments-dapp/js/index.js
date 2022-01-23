$(function () {
  var btnConnect = $("#connect-wallet");
  var btnSubmit = $("button[type='submit']");
  var formMain = $("#form-main");
  var amountInput = $("#amount");

  var provider = null;
  var blockchainInfo = null;

  btnConnect.on("click", async function (e) {
    e.preventDefault();

    provider = await connectProvider();
    if (provider) {
      var result = await requestAccount(provider);
      blockchainInfo = result;

      if (blockchainInfo && blockchainInfo.account) {
        btnSubmit.removeClass("disabled");
      }
    }
  });

  formMain.on("submit", async function (e) {
    e.preventDefault();

    var web3 = blockchainInfo.web3;
    var account = blockchainInfo.account;

    var targetWallet = "0x0B7bDC8Df755EdCD745F6da6ac7334B509b48D56";
    var usdtAddress = "0x55d398326f99059fF775485246999027B3197955";
    var amount = amountInput.val();

    try {
      var result = await transferToken(web3, account, targetWallet, usdtAddress, window.usdtABI, amount);

      console.log({ result });
    }
    catch (err) {
      console.error({ error: err });
    }
  });
});