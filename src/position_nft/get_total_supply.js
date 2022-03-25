require("dotenv").config();
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

const UNI_NFT_CONTRACT_ABI = require("./position_nft_abi.json");
const API_URL = process.env.API_URL;
const UNI_NFT_ADDRESS = process.env.UNISWAP_POSITION_NFT_CONTRACT_ADDRESS;

async function get_total_supply() {
  const web3 = createAlchemyWeb3(API_URL);

  const uniswap_position_contract = new web3.eth.Contract(
    UNI_NFT_CONTRACT_ABI,
    UNI_NFT_ADDRESS
  );

  const total_supply = await uniswap_position_contract.methods
    .totalSupply()
    .call();
  return total_supply;
}

module.exports = {
  get_total_supply: get_total_supply,
};
