const { expect, assert } = require("chai");
const { ethers, waffle } = require("hardhat");
const {
  addressFactory,
  addressRouter,
  addressFrom,
  addressTo,
} = require("../utils/addressList");
const { erc20ABI, factoryABI, routerABI } = require("../utils/abiList");

describe("Read and Write to the blockchain", () => {
  let provider,
    contractFactory,
    contractRouter,
    contractToken,
    decimals,
    amountIn;

  // connecting to provider
  provider = new ethers.providers.JsonRpcProvider(
    "https://eth-mainnet.g.alchemy.com/v2/TsK195p-rjwzJMx7OKym9FyyFjs8jdbO"
  );

  // contract address
  contractFactory = new ethers.Contract(addressFactory, factoryABI, provider);
  contractRouter = new ethers.Contract(addressRouter, routerABI, provider);
  contractToken = new ethers.Contract(addressFrom, erc20ABI, provider);

  // get price information
  const getAmountOut = async () => {
    decimals = await contractToken.decimals();
    const amountInHuman = "1";
    amountIn = ethers.utils.parseUnits(amountInHuman, decimals).toString();
    const amountsOut = await contractRouter.getAmountsOut(amountIn, [
      addressFrom,
      addressTo,
    ]);

    return amountsOut[1].toString();
  };

  it("connect to a provider, factory, token and router", () => {
    assert(provider._isProvider);
    expect(contractFactory.address).to.equal(
      "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
    );
    expect(contractRouter.address).to.equal(
      "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    );
  });

  it("get the price of amountsOut", async () => {
    const amount = await getAmountOut();
    assert(amount.toString());
  });

  it("send a transaction, swap a token", async () => {
    const [ownerSigner] = await ethers.getSigners();

    const mainetForkUniswapRouter = new ethers.Contract(
      addressRouter,
      routerABI,
      ownerSigner
    );
    const myAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const amountOut = await getAmountOut();
    const txSwap = await mainetForkUniswapRouter.swapExactTokensForTokens(
      amountIn, // amount In
      amountOut, // amount Out
      [addressFrom, addressTo], // path
      myAddress, // address to
      Date.now() * 1000 * 60 * 5, // deadline
      {
        gasLimit: 200000,
        gasPrice: ethers.utils.parseUnits("5.5", "gwei"),
      } // gas
    );

    assert(txSwap.hash);

    const mainetForkProvider = waffle.provider;
    const txReceipt = await mainetForkProvider.getTransactionReceipt(
      txSwap.hash
    );
    console.log("txSwap", txSwap);
    console.log("txReceipt", txReceipt);
  });
});
