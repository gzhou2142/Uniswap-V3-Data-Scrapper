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

const collections = require("./constants/collection_names");

async function swaps(POOL_ADDRESSES, retrieve_latest) {
  const swaps_params = {
    retrieve_latest: retrieve_latest,
    hour_interval: 0.5,
    verbose: 2,
  };

  for (let i = 0; i < POOL_ADDRESSES.length; i++) {
    await scrape_swap_data(
      POOL_ADDRESSES[i],
      collections.SWAP_DATA,
      swaps_params
    );
  }
}

async function ticks(POOL_ADDRESSES, retrieve_latest) {
  const ticks_params = {
    retrieve_latest: retrieve_latest,
    hour_interval: 48,
    verbose: 2,
  };
  for (let i = 0; i < POOL_ADDRESSES.length; i++) {
    await scrape_tick_day_data(
      POOL_ADDRESSES[i],
      collections.TICK_DAY_DATA,
      ticks_params
    );
  }
}

async function pool_day(POOL_ADDRESSES, retrieve_latest) {
  const pool_day_params = {
    retrieve_latest: retrieve_latest,
    hour_interval: 1200,
    verbose: 2,
  };
  for (let i = 0; i < POOL_ADDRESSES.length; i++) {
    await scrape_pool_day_data(
      POOL_ADDRESSES[i],
      collections.POOL_DAY_DATA,
      pool_day_params
    );
  }
}

async function pool_hour(POOL_ADDRESSES, retrieve_latest) {
  const pool_hour_params = {
    retrieve_latest: retrieve_latest,
    hour_interval: 96,
    verbose: 2,
  };
  for (let i = 0; i < POOL_ADDRESSES.length; i++) {
    await scrape_pool_hour_data(
      POOL_ADDRESSES[i],
      collections.POOL_HOUR_DATA,
      pool_hour_params
    );
  }
}

async function mints(POOL_ADDRESSES, retrieve_latest) {
  const params = {
    retrieve_latest: retrieve_latest,
    hour_interval: 48,
    verbose: 2,
  };
  for (let i = 0; i < POOL_ADDRESSES.length; i++) {
    await scrape_mint_data(POOL_ADDRESSES[i], collections.MINT_DATA, params);
  }
}

async function burns(POOL_ADDRESSES, retrieve_latest) {
  const params = {
    retrieve_latest: retrieve_latest,
    hour_interval: 48,
    verbose: 2,
  };
  for (let i = 0; i < POOL_ADDRESSES.length; i++) {
    await scrape_burn_data(POOL_ADDRESSES[i], collections.BURN_DATA, params);
  }
}

async function positions_snapshots(POOL_ADDRESSES, retrieve_latest) {
  const positionSnapshot_params = {
    retrieve_latest: retrieve_latest,
    hour_interval: 24,
    verbose: 2,
  };

  for (let i = 0; i < POOL_ADDRESSES.length; i++) {
    await scrape_position_snapshot_data(
      POOL_ADDRESSES[i],
      collections.POSITION_SNAPSHOT_DATA,
      positionSnapshot_params
    );
  }
}

async function token_day(TOKEN_ADDRESSES, retrieve_latest) {
  const token_day_params = {
    retrieve_latest: retrieve_latest,
    verbose: 2,
  };
  for (let i = 0; i < TOKEN_ADDRESSES.length; i++) {
    await scrape_token_day_data(
      TOKEN_ADDRESSES[i],
      collections.TOKEN_DAY_DATA,
      token_day_params
    );
  }
}

async function token_hour(TOKEN_ADDRESSES, retrieve_latest) {
  const token_hour_params = {
    retrieve_latest: retrieve_latest,
    verbose: 2,
  };
  for (let i = 0; i < TOKEN_ADDRESSES.length; i++) {
    await scrape_token_hour_data(
      TOKEN_ADDRESSES[i],
      collections.TOKEN_HOUR_DATA,
      token_hour_params
    );
  }
}

async function pools(retrieve_latest) {
  const params = {
    retrieve_latest: retrieve_latest,
    verbose: 2,
  };
  await scrape_pools_data(collections.POOL_DATA, params);
}

module.exports = {
  swaps,
  ticks,
  pool_day,
  pool_hour,
  mints,
  burns,
  positions_snapshots,
  token_day,
  token_hour,
  pools,
};
