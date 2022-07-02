const ethers = require("ethers");
const {
  addressFactory,
  addressRouter,
  addrressFrom,
  addressTo,
} = require("./addressList");
const { erc20ABI, factoryABI, routerABI, pairABI } = require("./abiList");

const provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org"
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
  console.log("amountIn", amountIn);
};

const amount = "500";
getPrice(amount);
