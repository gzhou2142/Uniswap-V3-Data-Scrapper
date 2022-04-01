const chalk = require("chalk");

const mongodb = require("../mongodb/mongodb");
const timestamp = require("../utils/timestamp");

const {
  request_pool_day_data,
  request_pool_hour_data,
  request_pool_data,
} = require("../request/request_poolData");
const print = require("../utils/print");
const { insert_data_unique_id } = require("../mongodb/insert_data");

const uniswap_start_timestamp = timestamp.from_date(2021, 5, 1);

async function scrape_pool_day_data(
  pool_addresses,
  collection_name,
  retrieve_missing = true,
  hour_interval = 1200,
  verbose = 1
) {
  const db = await mongodb.connect_db();
  const collection = await mongodb.get_collection(db, collection_name);

  for (const pool_address of pool_addresses) {
    let start_timestamp = timestamp.current();
    let end_timestamp = Date.now();

    let total_data = 0;
    let total_insert = 0;

    print.pool_collection_info(collection_name, pool_address);

    while (uniswap_start_timestamp < end_timestamp) {
      const data = await request_pool_day_data(
        pool_address,
        parseInt(start_timestamp / 1000),
        parseInt(end_timestamp / 1000)
      );
      const insert_status = await insert_data_unique_id(collection, data);
      if (verbose >= 2) {
        print.insert_info(start_timestamp, insert_status);
      }
      total_data += insert_status.data_count;
      total_insert += insert_status.inserted_count;
      if (
        retrieve_missing &&
        insert_status.inserted_count == 0 &&
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
        Date.now(),
        total_data,
        total_insert
      );
    }
  }

  mongodb.close_client();
}

async function scrape_pool_hour_data(
  pool_addresses,
  collection_name,
  retrieve_latest = true,
  verbose = 1
) {
  const db = await mongodb.connect_db();
  const collection = await mongodb.get_collection(db, collection_name);

  for (const pool_address of pool_addresses) {
    let start_timestamp = timestamp.current();
    let end_timestamp = Date.now();
    let total_data_count = 0;
    let total_insert_count = 0;

    print.pool_collection_info(collection_name, pool_address);

    while (uniswap_start_timestamp < end_timestamp) {
      const data = await request_pool_hour_data(
        pool_address,
        parseInt(start_timestamp / 1000),
        parseInt(end_timestamp / 1000)
      );
      const insert_status = await insert_data_unique_id(collection, data);
      if (verbose >= 2) print.insert_info(start_timestamp, insert_status);
      total_data_count += insert_status.data_count;
      total_insert_count += insert_status.inserted_count;
      if (
        retrieve_latest &&
        insert_status.inserted_count === 0 &&
        insert_status.data_count != 0
      ) {
        break;
      }
      end_timestamp = start_timestamp;
      start_timestamp = timestamp.previous_day(start_timestamp);
    }

    if (verbose >= 1) {
      print.total_insert_info(
        start_timestamp,
        Date.now(),
        total_data_count,
        total_insert_count
      );
    }
  }
  mongodb.close_client();
}

async function scrape_pools_data(
  collection_name,
  retrieve_latest = true,
  hour_interval = 48,
  verbose = 1
) {
  const db = await mongodb.connect_db();
  const collection = await mongodb.get_collection(db, collection_name);
  let start_timestamp = timestamp.current();
  let end_timestamp = Date.now();
  let total_data_count = 0;
  let total_insert_count = 0;

  console.log(`Downloading ${chalk.green(collection_name)}`);

  while (uniswap_start_timestamp < end_timestamp) {
    const data = await request_pool_data(
      parseInt(start_timestamp / 1000),
      parseInt(end_timestamp / 1000)
    );
    const insert_status = await insert_data_unique_id(collection, data);
    if (verbose >= 2) {
      print.insert_info(start_timestamp, insert_status);
    }
    total_data_count += insert_status.data_count;
    total_insert_count += insert_status.inserted_count;
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
      Date.now(),
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
