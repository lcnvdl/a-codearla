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

  formMain.on("submit", function (e) {
    e.preventDefault();

  });
});