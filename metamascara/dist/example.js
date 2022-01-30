const { MetaMascara } = meta;

const instance = new MetaMascara(provider => new Web3(provider), detectEthereumProvider);

const connectBtn = $("#connect-wallet");
const networkTitle = $("#current-network");

connectBtn.on("click", async (ev) => {
  ev.preventDefault();

  connectBtn.attr("disabled", true);

  try {
    const result = await instance.connect();
    if (result) {
      networkTitle.text(`Connected to ${instance.networkName}`);
    }
    else {
      connectBtn.attr("disabled", false);
    }
  }
  catch (err) {
    connectBtn.attr("disabled", false);
  }
});