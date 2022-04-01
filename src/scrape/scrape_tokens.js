const chalk = require("chalk");

const mongodb = require("../mongodb/mongodb");
const timestamp = require("../utils/timestamp");

const {
  request_token_day_data,
  request_token_hour_data,
} = require("../request/request_tokenData");
const { insert_data_unique_id } = require("../mongodb/insert_data");
const uniswap_start_timestamp = timestamp.from_date(2021, 5, 1);

async function scrape_token_day_data(
  token_addresses,
  collection_name,
  retrieve_latest = true,
  hour_interval = 1200
) {
  const db = await mongodb.connect_db();
  const collection = await mongodb.get_collection(db, collection_name);

  for (const token_address of token_addresses) {
    let start_timestamp = timestamp.current();
    let end_timestamp = Date.now();
    console.log(
      chalk.cyan(`Downloading token day data for token ${token_address}`)
    );

    while (uniswap_start_timestamp < end_timestamp) {
      const data = await request_token_day_data(
        token_address,
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
        retrieve_latest &&
        insert_status.inserted_count === 0 &&
        insert_status.data_count != 0
      ) {
        break;
      }
      end_timestamp = start_timestamp;
      start_timestamp = timestamp.add_hours(start_timestamp, -hour_interval);
    }
  }
  mongodb.close_client();
}

async function scrape_token_hour_data(
  token_addresses,
  collection_name,
  retrieve_latest = true,
  hour_interval = 48
) {
  const db = await mongodb.connect_db();
  const collection = await mongodb.get_collection(db, collection_name);

  for (const token_address of token_addresses) {
    let start_timestamp = timestamp.current();
    let end_timestamp = Date.now();
    console.log(
      chalk.cyan(`Downloading token hour data for token ${token_address}`)
    );
    while (uniswap_start_timestamp < end_timestamp) {
      const data = await request_token_hour_data(
        token_address,
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
        retrieve_latest &&
        insert_status.inserted_count === 0 &&
        insert_status.data_count != 0
      ) {
        break;
      }
      end_timestamp = start_timestamp;
      start_timestamp = timestamp.add_hours(start_timestamp, -hour_interval);
    }
  }

  mongodb.close_client();
}

module.exports = {
  scrape_token_day_data: scrape_token_day_data,
  scrape_token_hour_data: scrape_token_hour_data,
};
