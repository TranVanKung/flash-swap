const ethers = require("ethers");
const {
  addressFactory,
  addressRouter,
  addrressFrom,
  addressTo,
} = require("./addressList");
const { erc20ABI, factoryABI, routerABI, pairABI } = require("./abiList");

const provider = new ethers.providers.JsonRpcProvider(
  "https://eth-mainnet.g.alchemy.com/v2/TsK195p-rjwzJMx7OKym9FyyFjs8jdbO"
);

// connect to factory
const contractFactory = new ethers.Contract(
  addressFactory,
  factoryABI,
  provider
);

// connect to Router
const contractRouter = new ethers.Contract(addressRouter, routerABI, provider);

// call the blockchain
const getPrice = async (amountInHuman) => {
  // convert the amount in
  const contractToken = new ethers.Contract(addrressFrom, erc20ABI, provider);
  const decimals = await contractToken.decimals();
  const amountIn = ethers.utils.parseUnits(amountInHuman, decimals).toString();

  const amountOut = await contractRouter.getAmountsOut(amountIn, [
    addrressFrom, // BUSD
    addressTo, // WETH
  ]);

  // convert amount out - decimals
  const contractToken1 = new ethers.Contract(addressTo, erc20ABI, provider);
  const decimals1 = await contractToken1.decimals();

  // convert amount out - human readable
  const amountOutHuman = ethers.utils.formatUnits(
    amountOut[1].toString(),
    decimals1
  );
  console.log("amountOutHuman", amountOutHuman);
};

const amount = "1";
getPrice(amount);
