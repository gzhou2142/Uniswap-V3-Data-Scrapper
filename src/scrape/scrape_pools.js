const chalk = require("chalk");

const mongodb = require("../mongodb/mongodb");
const timestamp = require("../utils/timestamp");

const {
  request_pool_day_data,
  request_pool_hour_data,
  request_pool_data,
} = require("../request/request_poolData");
const print = require("../utils/print");
const {
  request_insert,
  auto_hour_interval,
  get_start_ts,
} = require("./scrape_utils");

const uniswap_start_timestamp = timestamp.from_date(2021, 5, 1);

async function scrape_pool_day_data(pool_address, collection_name, params) {
  const db = await mongodb.connect_db();
  const collection = await mongodb.get_collection(db, collection_name);

  const retrieve_latest = params.retrieve_latest;
  const verbose = params.verbose;

  const query_params = {
    query: { "pool.id": pool_address },
    sort: { date: -1 },
    ts_attribute: "date",
  };

  const start_ts = await get_start_ts(
    db,
    collection,
    retrieve_latest,
    pool_address,
    query_params
  );
  const end_ts = Date.now();

  print.pool_collection_info(collection_name, pool_address);

  let total_data = 0;
  let total_insert = 0;
  let hour_interval = 1200;
  let prev_ts = timestamp.add_hours(start_ts, -3);
  let current_ts = start_ts;

  while (prev_ts < end_ts) {
    const input = {
      pool_address: pool_address,
      start_timestamp: prev_ts,
      end_timestamp: current_ts,
    };
    const insert_status = await request_insert(
      request_pool_day_data,
      collection,
      input
    );
    if (!insert_status.success) {
      throw Error(
        `Failed to get pool day data between timestamp ${prev_ts}-${current_ts}`
      );
    }
    if (verbose >= 2) print.insert_info(prev_ts, insert_status);

    total_data += insert_status.data_count;
    total_insert += insert_status.inserted_count;

    prev_ts = current_ts;
    current_ts = timestamp.add_hours(current_ts, hour_interval);
  }

  if (verbose >= 1) {
    print.total_insert_info(start_ts, end_ts, total_data, total_insert);
  }

  mongodb.close_client();
}

async function scrape_pool_hour_data(pool_address, collection_name, params) {
  const db = await mongodb.connect_db();
  const collection = await mongodb.get_collection(db, collection_name);

  const retrieve_latest = params.retrieve_latest;
  const verbose = params.verbose;

  const query_params = {
    query: { "pool.id": pool_address },
    sort: { periodStartUnix: -1 },
    ts_attribute: "periodStartUnix",
  };

  const start_ts = await get_start_ts(
    db,
    collection,
    retrieve_latest,
    pool_address,
    query_params
  );
  const end_ts = Date.now();

  print.pool_collection_info(collection_name, pool_address);

  let total_data_count = 0;
  let total_insert_count = 0;
  let hour_interval = 96;
  let prev_ts = timestamp.add_hours(start_ts, -3);
  let current_ts = start_ts;

  while (prev_ts <= end_ts) {
    const input = {
      pool_address: pool_address,
      start_timestamp: prev_ts,
      end_timestamp: current_ts,
    };
    const insert_status = await request_insert(
      request_pool_hour_data,
      collection,
      input
    );
    if (!insert_status.success) {
      throw Error(
        `Failed to get pool hour data between timestamp ${prev_ts}-${current_ts}`
      );
    }
    if (verbose >= 2) print.insert_info(prev_ts, insert_status);
    total_data_count += insert_status.data_count;
    total_insert_count += insert_status.inserted_count;

    prev_ts = current_ts;
    current_ts = timestamp.add_hours(current_ts, hour_interval);
  }

  if (verbose >= 1) {
    print.total_insert_info(
      start_ts,
      end_ts,
      total_data_count,
      total_insert_count
    );
  }
  mongodb.close_client();
}

async function scrape_pools_data(collection_name, params) {
  const retrieve_latest = params.retrieve_latest;
  const verbose = params.verbose;

  const db = await mongodb.connect_db();
  const collection = await mongodb.get_collection(db, collection_name);

  const latest_entry = await mongodb.find_entry_sort(
    collection,
    {},
    { createdAtTimestamp: -1 }
  );

  let start_ts;
  let end_ts = Date.now();
  if (retrieve_latest && latest_entry) {
    start_ts = Number(latest_entry.createdAtTimestamp) * 1000;
  } else {
    start_ts = uniswap_start_timestamp;
  }

  let hour_interval = 24;
  let prev_ts = timestamp.add_hours(start_ts, -3);
  let current_ts = start_ts;

  let total_data_count = 0;
  let total_insert_count = 0;
  console.log(`Downloading ${chalk.green(collection_name)}`);

  while (prev_ts < end_ts) {
    const input = {
      start_timestamp: prev_ts,
      end_timestamp: current_ts,
    };
    const insert_status = await request_insert(
      request_pool_data,
      collection,
      input
    );
    if (verbose >= 2) {
      print.insert_info(prev_ts, insert_status);
    }
    total_data_count += insert_status.data_count;
    total_insert_count += insert_status.inserted_count;
    hour_interval = auto_hour_interval(hour_interval, insert_status.data_count);
    prev_ts = current_ts;
    current_ts = timestamp.add_hours(current_ts, hour_interval);
  }

  if (verbose >= 1) {
    print.total_insert_info(
      start_ts,
      end_ts,
      total_data_count,
      total_insert_count
    );
  }

  mongodb.close_client();
}

module.exports = {
  scrape_pools_data: scrape_pools_data,
  scrape_pool_hour_data: scrape_pool_hour_data,
  scrape_pool_day_data: scrape_pool_day_data,
};
