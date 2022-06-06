const mongodb = require("../mongodb/mongodb");
const timestamp = require("../utils/timestamp");

const { request_swap_data } = require("../request/request_swapData");
const { request_insert, auto_hour_interval } = require("./scrape_utils");
const print = require("../utils/print");

const uniswap_start_timestamp = timestamp.from_date(2021, 5, 2);

async function scrape_swap_data(pool_address, collection_name, params) {
  const db = await mongodb.connect_db();
  const collection = await mongodb.get_collection(db, collection_name);

  const retrieve_latest = params.retrieve_latest;
  const verbose = params.verbose;

  const latest_entry = await mongodb.find_entry_sort(
    collection,
    { "pool.id": pool_address },
    { "transaction.timestamp": -1 }
  );
  let start_ts;
  if (retrieve_latest && latest_entry) {
    start_ts = Number(latest_entry.transaction.timestamp) * 1000;
  } else {
    let call_success = false;
    let pool_data;
    try {
      const pool_collection = await mongodb.get_collection(db, "poolData");
      pool_data = await mongodb.find_entry_sort(
        pool_collection,
        { id: pool_address },
        { timestamp: -1 }
      );
      call_success = true;
    } catch (e) {
      call_success = false;
    }
    if (pool_data && call_success) {
      start_ts = Number(pool_data.createdAtTimestamp) * 1000;
    } else {
      start_ts = uniswap_start_timestamp;
    }
  }

  const end_ts = Date.now();

  print.pool_collection_info(collection.namespace, pool_address);

  let total_data = 0;
  let total_insert = 0;
  let hour_interval = 6;
  let prev_ts = timestamp.add_hours(start_ts, -1);
  let current_ts = start_ts;
  while (prev_ts <= end_ts) {
    const input = {
      pool_address: pool_address,
      start_timestamp: prev_ts,
      end_timestamp: current_ts,
    };
    const insert_status = await request_insert(
      request_swap_data,
      collection,
      input
    );
    if (!insert_status.success) {
      throw Error(
        `Failed to get swaps between timestamp ${prev_ts}-${current_ts}`
      );
    }
    if (verbose >= 2) print.insert_info(prev_ts, insert_status);
    total_data += insert_status.data_count;
    total_insert += insert_status.inserted_count;
    hour_interval = auto_hour_interval(hour_interval, insert_status.data_count);
    prev_ts = current_ts;
    current_ts = timestamp.add_hours(current_ts, hour_interval);
  }
  if (verbose >= 1) {
    print.total_insert_info(start_ts, end_ts, total_data, total_insert);
  }
  mongodb.close_client();
}

module.exports = {
  scrape_swap_data: scrape_swap_data,
};
