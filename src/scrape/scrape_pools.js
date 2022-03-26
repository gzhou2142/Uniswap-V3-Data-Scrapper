const chalk = require("chalk");

const {
  connect_db,
  close_client,
  get_collection,
} = require("../mongodb/connect_mongo");
const {
  get_current_day_timestamp,
  day_to_timestamp,
  add_hours_timestamp,
  get_previous_day_timestamp,
} = require("../utils/timestamps");

const {
  request_pool_day_data,
  request_pool_hour_data,
  request_pool_data,
} = require("../request/request_poolData");
const { insert_data_unique_id } = require("../mongodb/insert_data");

const uniswap_start_timestamp = day_to_timestamp(2021, 5, 1);

async function scrape_pool_day_data(
  pool_address,
  collection_name,
  scrape_missing = true
) {
  const db = await connect_db();
  const collection = await get_collection(db, collection_name);

  let timestamp = get_current_day_timestamp();
  console.log(chalk.cyan(`Downloading pool day data for pool ${pool_address}`));

  while (uniswap_start_timestamp < timestamp) {
    const data = await request_pool_day_data(pool_address, timestamp / 1000);
    const insert_status = await insert_data_unique_id(collection, data);
    var date = new Date(timestamp);
    console.log(
      `${date.toUTCString()}     count: ${
        insert_status.data_count
      }     inserted: ${insert_status.inserted_count}`
    );
    if (scrape_missing && insert_status.inserted_count == 0) {
      break;
    }
    timestamp = get_previous_day_timestamp(timestamp);
  }
  close_client();
}

async function scrape_pool_hour_data(
  pool_address,
  collection_name,
  scrape_missing = true
) {
  const db = await connect_db();
  const collection = await get_collection(db, collection_name);
  let start_timestamp = get_current_day_timestamp();
  let end_timestamp = Date.now();

  console.log(
    chalk.cyan(`Downloading pool hour data for pool ${pool_address}`)
  );

  while (uniswap_start_timestamp < end_timestamp) {
    const data = await request_pool_hour_data(
      pool_address,
      parseInt(start_timestamp / 1000),
      parseInt(end_timestamp / 1000)
    );
    const insert_status = await insert_data_unique_id(collection, data);
    var date = new Date(start_timestamp);
    console.log(
      `${date.toUTCString()}     count: ${
        insert_status.data_count
      }     inserted: ${insert_status.inserted_count}`
    );
    if (
      scrape_missing &&
      insert_status.inserted_count === 0 &&
      insert_status.data_count != 0
    ) {
      break;
    }
    end_timestamp = start_timestamp;
    start_timestamp = get_previous_day_timestamp(start_timestamp);
  }
  close_client();
}

async function scrape_pools_data(
  collection_name,
  scrape_missing = true,
  scrape_hour_interval = 48
) {
  const db = await connect_db();
  const collection = await get_collection(db, collection_name);

  let start_timestamp = get_current_day_timestamp();
  let end_timestamp = Date.now();

  console.log(chalk.cyan(`Downloading pools data`));

  while (uniswap_start_timestamp < end_timestamp) {
    const data = await request_pool_data(
      parseInt(start_timestamp / 1000),
      parseInt(end_timestamp / 1000)
    );
    const insert_status = await insert_data_unique_id(collection, data);
    var date = new Date(start_timestamp);
    console.log(
      `${date.toUTCString()}     count: ${
        insert_status.data_count
      }     inserted: ${insert_status.inserted_count}`
    );
    if (
      scrape_missing &&
      insert_status.inserted_count === 0 &&
      insert_status.data_count != 0
    ) {
      break;
    }
    end_timestamp = start_timestamp;
    start_timestamp = add_hours_timestamp(
      start_timestamp,
      -scrape_hour_interval
    );
  }
  close_client();
}

module.exports = {
  scrape_pools_data: scrape_pools_data,
  scrape_pool_hour_data: scrape_pool_hour_data,
  scrape_pool_day_data: scrape_pool_day_data,
};
