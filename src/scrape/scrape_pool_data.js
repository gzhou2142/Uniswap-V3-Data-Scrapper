const chalk = require('chalk')

const {
  connect_db,
  close_client,
  get_collection,
} = require("../mongodb/connect_mongo");
const {
  get_current_day_timestamp,
  day_to_timestamp,
  get_previous_day_timestamp,
} = require("../utils/timestamps");

const { request_pool_day_data } = require("../request/request_poolDayData");
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
  console.log(chalk.cyan(`Downloading pool data for pool ${pool_address}`));

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

module.exports = {
  scrape_pool_day_data: scrape_pool_day_data,
};
