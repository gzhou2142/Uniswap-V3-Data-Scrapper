require("dotenv").config();

const { scrape_tick_day_data } = require("./scrape/scrape_ticks");
const {
  scrape_pools_data,
  scrape_pool_day_data,
  scrape_pool_hour_data,
} = require("./scrape/scrape_pools");
const { scrape_mint_data } = require("./scrape/scrape_mints");
const { scrape_burn_data } = require("./scrape/scrape_burns");
const {
  scrape_position_snapshot_data,
} = require("./scrape/scrape_positionSnapshot");
const { scrape_swap_data } = require("./scrape/scrape_swaps");
const {
  scrape_token_day_data,
  scrape_token_hour_data,
} = require("./scrape/scrape_tokens");

const { TOKEN_ADDRESSES } = require("./constants/token_address");
const {
  TOKEN_DAY_DATA,
  TOKEN_HOUR_DATA,
} = require("./constants/collection_names");
const USDC_ETH_PAIR_ADDRESS = process.env.USDC_ETH_PAIR_ADDRESS;
const TICK_DAY_DATA_COLLECTION = process.env.TICK_DAY_DATA;
const POOL_DAY_DATA_COLLECTION = process.env.POOL_DAY_DATA;
const MINT_DATA_COLLECTION = process.env.MINT_DATA;
const BURN_DATA_COLLECTION = process.env.BURN_DATA;
const POSITION_SNAPSHOT_COLLECTION = process.env.POSITION_SNAPSHOT_DATA;
const SWAP_DATA_COLLECTION = process.env.SWAP_DATA;
const POOL_DATA_COLLECTION = process.env.POOL_DATA;
const POOL_HOUR_DATA_COLLECTION = process.env.POOL_HOUR_DATA;

async function main() {
  // await scrape_tick_day_data(USDC_ETH_PAIR_ADDRESS, TICK_DAY_DATA_COLLECTION);
  // await scrape_pool_day_data(USDC_ETH_PAIR_ADDRESS, POOL_DAY_DATA_COLLECTION);
  // await scrape_mint_data(USDC_ETH_PAIR_ADDRESS, MINT_DATA_COLLECTION);
  // await scrape_burn_data(USDC_ETH_PAIR_ADDRESS, BURN_DATA_COLLECTION);
  // await scrape_position_snapshot_data(
  //   USDC_ETH_PAIR_ADDRESS,
  //   POSITION_SNAPSHOT_COLLECTION
  // );
  // await scrape_swap_data(USDC_ETH_PAIR_ADDRESS, SWAP_DATA_COLLECTION);
  // await scrape_pools_data(POOL_DATA_COLLECTION);
  // await scrape_pool_hour_data(USDC_ETH_PAIR_ADDRESS, POOL_HOUR_DATA_COLLECTION);

  await scrape_token_day_data(TOKEN_ADDRESSES, TOKEN_DAY_DATA);
  await scrape_token_hour_data(TOKEN_ADDRESSES, TOKEN_HOUR_DATA);
}

main();
