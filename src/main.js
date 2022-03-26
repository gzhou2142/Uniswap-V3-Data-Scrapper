require("dotenv").config();

const { scrape_tick_day_data } = require("./scrape/scrape_tick_data");
const { scrape_pool_day_data } = require("./scrape/scrape_pool_data");
const { scrape_mint_data } = require("./scrape/scrape_mint_data");
const { scrape_burn_data } = require("./scrape/scrape_burn_data");
const {
  scrape_position_snapshot_data,
} = require("./scrape/scrape_positionSnapshot");
const { scrape_swap_data } = require("./scrape/scrape_swap_data");

const USDC_ETH_PAIR_ADDRESS = process.env.USDC_ETH_PAIR_ADDRESS;

const TICK_DAY_DATA_COLLECTION = process.env.TICK_DAY_DATA;
const POOL_DAY_DATA_COLLECTION = process.env.POOL_DAY_DATA;
const MINT_DATA_COLLECTION = process.env.MINT_DATA;
const BURN_DATA_COLLECTION = process.env.BURN_DATA;
const POSITION_SNAPSHOT_COLLECTION = process.env.POSITION_SNAPSHOT_DATA;
const SWAP_DATA_COLLECTION = process.env.SWAP_DATA;

async function main() {
  await scrape_tick_day_data(USDC_ETH_PAIR_ADDRESS, TICK_DAY_DATA_COLLECTION);
  await scrape_pool_day_data(USDC_ETH_PAIR_ADDRESS, POOL_DAY_DATA_COLLECTION);
  await scrape_mint_data(USDC_ETH_PAIR_ADDRESS, MINT_DATA_COLLECTION);
  await scrape_burn_data(USDC_ETH_PAIR_ADDRESS, BURN_DATA_COLLECTION);
  await scrape_position_snapshot_data(
    USDC_ETH_PAIR_ADDRESS,
    POSITION_SNAPSHOT_COLLECTION
  );
  await scrape_swap_data(USDC_ETH_PAIR_ADDRESS, SWAP_DATA_COLLECTION);
}

main();
