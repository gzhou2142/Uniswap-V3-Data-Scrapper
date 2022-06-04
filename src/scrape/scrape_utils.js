const mongodb = require("../mongodb/mongodb");
const timestamp = require("../utils/timestamp");
const print = require("../utils/print");

async function request_insert(request_func, collection, input) {
  const max_tries = 10;
  let num_tries = 1;
  let success = false;
  let insert_status;
  while (num_tries <= max_tries) {
    try {
      const data = await request_func(input);
      insert_status = await mongodb.update_unique(collection, data);
      success = true;
      break;
    } catch (e) {
      print.request_error(collection.namespace, num_tries, input);
      print.red(e.message);
      num_tries += 1;
    }
  }
  return { success: success, ...insert_status };
}

async function get_start_ts(
  db,
  collection,
  retrieve_latest,
  pool_address,
  query_params
) {
  const uniswap_start_timestamp = timestamp.from_date(2021, 5, 1);
  const latest_entry = await mongodb.find_entry_sort(
    collection,
    query_params.query,
    query_params.sort
  );
  if (retrieve_latest && latest_entry) {
    start_ts = Number(latest_entry[query_params.ts_attribute]) * 1000;
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
  return start_ts;
}

function auto_hour_interval(current_interval, num_entries) {
  if (num_entries > 300) {
    const ratio = num_entries / 200;
    return parseInt(current_interval / ratio);
  } else if (num_entries < 50) {
    return current_interval * 2;
  } else {
    return current_interval;
  }
}

module.exports = {
  request_insert: request_insert,
  auto_hour_interval: auto_hour_interval,
  get_start_ts: get_start_ts,
};
