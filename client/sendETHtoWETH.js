const { ethers } = require("ethers");
// testnet provider
const providerTestnet = new ethers.providers.JsonRpcProvider(
  "https://eth-rinkeby.alchemyapi.io/v2/jQZ1FmTk-pjFAyoMkEeQ7rbgr0-b0t3_"
);

// create signer
const myAddress = "0xAc306cF29744b0f61cDf8575FEa50b9946b67731";
const privateKey =
  "4f388fb37ab3e18803c7ed4e846a3ab662907bed69b1f3ce03c6b673481b2410";
const walletSigner = new ethers.Wallet(privateKey, providerTestnet);

const exchangeETH = async () => {
  const sendValueHuman = "0.005";
  const gasPrice = await providerTestnet.getGasPrice();
  const nonce = await walletSigner.getTransactionCount(); // web3.eth.getTransactionCount(walletAddress)
  console.log("nonce", nonce);

  const txBuild = {
    from: myAddress,
    to: "0xDf032Bc4B9dC2782Bb09352007D4C57B75160B15", // WETH on rinkey test network
    value: ethers.utils.parseEther(sendValueHuman),
    nonce: nonce,
    gasLimit: 100000,
    gasPrice: gasPrice,
  };

  // send transaction
  const txSend = await walletSigner.sendTransaction(txBuild);
  console.log("txSend", txSend);
};

exchangeETH();
