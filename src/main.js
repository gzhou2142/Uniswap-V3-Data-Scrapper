require("dotenv").config();

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

const uniswap = require("./uniswap");

const { TOKEN_ADDRESSES } = require("./constants/token_address");
const { POOL_ADDRESSES } = require("./constants/pool_address");

/**
 * pool_id
 * 0 - all pools
 * 1 - USDC/ETH 0.3
 * 2 - USDC/ETH 0.05
 * 3 - USDT/ETH 0.05
 * 4 - USDC/USDT 0.01
 * 5 - BTC/ETH 0.05
 * 6 - ETH/USDT 0.3
 **/

async function main() {
  const retrieve_latest = argv.latest ? true : false;
  const pool_id = argv.pool_id ? argv.pool_id - 1 : -1;

  let pools;
  if (pool_id === -1) {
    pools = POOL_ADDRESSES;
  } else {
    pools = [POOL_ADDRESSES[pool_id]];
  }

  if (argv.swaps) {
    await uniswap.swaps(pools, retrieve_latest);
  } else if (argv.ticks) {
    await uniswap.ticks(pools, retrieve_latest);
  } else if (argv.pool_day) {
    await uniswap.pool_day(pools, retrieve_latest);
  } else if (argv.pool_hour) {
    await uniswap.pool_hour(pools, retrieve_latest);
  } else if (argv.mints) {
    await uniswap.mints(pools, retrieve_latest);
  } else if (argv.burns) {
    await uniswap.burns(pools, retrieve_latest);
  } else if (argv.positions) {
    await uniswap.positions_snapshots(pools, retrieve_latest);
  } else if (argv.token_hour) {
    await uniswap.token_hour(TOKEN_ADDRESSES, retrieve_latest);
  } else if (argv.pools) {
    await uniswap.pools(retrieve_latest);
  } else if (argv.project) {
    const pool = [POOL_ADDRESSES[0]]
    await uniswap.ticks(pool, retrieve_latest);
    await uniswap.pool_day(pool, retrieve_latest);
    await uniswap.pool_hour(pool, retrieve_latest);
    await uniswap.positions_snapshots(pool, retrieve_latest);
  }
}

main();
