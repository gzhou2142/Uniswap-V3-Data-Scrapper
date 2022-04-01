const mongodb = require("../mongodb/mongodb");
const timestamp = require("../utils/timestamp");

const { request_swap_data } = require("../request/request_swapData");
const { request_insert } = require("./scrape_utils");
const print = require("../utils/print");

const uniswap_start_timestamp = timestamp.from_date(2021, 5, 2);

async function earliest_swap_ts(collection, pool_address) {
  const query = { "pool.id": pool_address };
  const sort = { "transaction.timestamp": 1 };
  const earliest_entry = await mongodb.find_entry_sort(collection, query, sort);
  return Number(earliest_entry.transaction.timestamp) * 1000;
}

function round_timestamp(timestamp) {
  let d = new Date(timestamp);
  d.setUTCHours(d.getUTCHours() + 1, 0, 0, 0);
  return d.getTime();
}

async function scrape_swap_data(pool_address, collection_name, params) {
  const db = await mongodb.connect_db();
  const collection = await mongodb.get_collection(db, collection_name);

  const retrieve_latest = params.retrieve_latest;
  const hour_interval = params.hour_interval;
  const verbose = params.verbose;

  // let begin_timestamp;
  // if (retrieve_latest) {
  //   begin_timestamp = Date.now();
  // } else {
  //   begin_timestamp = await earliest_swap_ts(collection, pool_address);
  // }

  let begin_timestamp = Date.now();

  let end_timestamp = round_timestamp(begin_timestamp);
  let start_timestamp = timestamp.add_hours(end_timestamp, -hour_interval);
  let total_data = 0,
    total_insert = 0;

  print.pool_collection_info(collection.namespace, pool_address);
  while (uniswap_start_timestamp < end_timestamp) {
    const input = {
      pool_address: pool_address,
      start_timestamp: start_timestamp,
      end_timestamp: end_timestamp,
    };
    const insert_status = await request_insert(
      request_swap_data,
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
    start_timestamp = timestamp.add_hours(start_timestamp, -hour_interval);
  }
  if (verbose >= 1) {
    print.total_insert_info(
      start_timestamp,
      begin_timestamp,
      total_data,
      total_insert
    );
  }
  mongodb.close_client();
}

module.exports = {
  scrape_swap_data: scrape_swap_data,
};
