const mongodb = require("../mongodb/mongodb");

const timestamp = require("../utils/timestamp");

const { request_burn_data } = require("../request/request_burnData");
const { request_insert } = require("./scrape_utils");
const print = require("../utils/print");

const uniswap_start_timestamp = timestamp.from_date(2021, 5, 1);

async function scrape_burn_data(
  pool_address,
  collection_name,
  params
) {
  const db = await mongodb.connect_db();
  const collection = await mongodb.get_collection(db, collection_name);

  const retrieve_latest = params.retrieve_latest;
  const hour_interval = params.hour_interval;
  const verbose = params.verbose;

  let start_timestamp = timestamp.current();
  let end_timestamp = Date.now();
  // let end_timestamp = Date.UTC(2022, 1 - 1, 4, 0, 0, 0);
  // let start_timestamp = timestamp.previous_day(end_timestamp);
  let total_data = 0;
  let total_insert = 0;

  print.pool_collection_info(collection_name, pool_address);
  while (uniswap_start_timestamp < end_timestamp) {
    const input = {
      pool_address: pool_address,
      start_timestamp: start_timestamp,
      end_timestamp: end_timestamp,
    };

    const insert_status = await request_insert(
      request_burn_data,
      collection,
      input
    );
    if (!insert_status.success) break;

    if (verbose >= 2) print.insert_info(start_timestamp, insert_status);

    total_data += insert_status.data_count;
    total_insert += insert_status.inserted_count;
    if (
      retrieve_latest &&
      insert_status.inserted_count === 0 &&
      insert_status.data_count != 0
    ) {
      break;
    }
    end_timestamp = start_timestamp;
    start_timestamp = timestamp.add_hours(start_timestamp, -1 * hour_interval);
  }
  if (verbose >= 1) {
    print.total_insert_info(
      start_timestamp,
      Date.now(),
      total_data,
      total_insert
    );
  }
  mongodb.close_client();
}

module.exports = {
  scrape_burn_data: scrape_burn_data,
};
