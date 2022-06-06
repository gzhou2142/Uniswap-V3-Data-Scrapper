const chalk = require("chalk");

const mongodb = require("../mongodb/mongodb");
const timestamp = require("../utils/timestamp");

const {
  request_token_day_data,
  request_token_hour_data,
} = require("../request/request_tokenData");
const { insert_data_unique_id } = require("../mongodb/insert_data");

const { request_insert } = require("./scrape_utils");

const print = require("../utils/print");

const uniswap_start_timestamp = timestamp.from_date(2021, 5, 1);

async function get_start_token_ts(collection, retrieve_latest, query_params) {
  const latest_entry = await mongodb.find_entry_sort(
    collection,
    query_params.query,
    query_params.sort
  );
  let start_ts;
  if (retrieve_latest && latest_entry) {
    start_ts = Number(latest_entry[query_params.ts_attribute]) * 1000;
  } else {
    start_ts = uniswap_start_timestamp;
  }
  return start_ts;
}

async function scrape_token_day_data(token_address, collection_name, params) {
  const retrieve_latest = params.retrieve_latest;
  const verbose = params.verbose;

  const db = await mongodb.connect_db();
  const collection = await mongodb.get_collection(db, collection_name);

  const query_params = {
    query: { "token.id": token_address },
    sort: { date: -1 },
    ts_attribute: "date",
  };
  const start_ts = await get_start_token_ts(
    collection,
    retrieve_latest,
    query_params
  );
  const end_ts = Date.now();

  print.token_collection_info(collection_name, token_address);

  let total_data = 0;
  let total_insert = 0;
  let hour_interval = 1200;
  let prev_ts = timestamp.add_hours(start_ts, -3);
  let current_ts = start_ts;

  while (prev_ts <= end_ts) {
    const input = {
      token_address: token_address,
      start_timestamp: prev_ts,
      end_timestamp: current_ts,
    };
    const insert_status = await request_insert(
      request_token_day_data,
      collection,
      input
    );

    if (!insert_status.success) {
      throw Error(
        `Failed to get token day data between timestamp ${prev_ts}-${current_ts}`
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

async function scrape_token_hour_data(token_address, collection_name, params) {
  const retrieve_latest = params.retrieve_latest;
  const verbose = params.verbose;

  const db = await mongodb.connect_db();
  const collection = await mongodb.get_collection(db, collection_name);

  const query_params = {
    query: { "token.id": token_address },
    sort: { periodStartUnix: -1 },
    ts_attribute: "periodStartUnix",
  };
  const start_ts = await get_start_token_ts(
    collection,
    retrieve_latest,
    query_params
  );
  const end_ts = Date.now();

  print.token_collection_info(collection_name, token_address);

  let total_data = 0;
  let total_insert = 0;
  let hour_interval = 96;
  let prev_ts = timestamp.add_hours(start_ts, -3);
  let current_ts = start_ts;

  while (prev_ts <= end_ts) {
    const input = {
      token_address: token_address,
      start_timestamp: prev_ts,
      end_timestamp: current_ts,
    };
    const insert_status = await request_insert(
      request_token_hour_data,
      collection,
      input
    );
    if (!insert_status.success) {
      throw Error(
        `Failed to get token hour data between timestamp ${prev_ts}-${current_ts}`
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

// async function scrape_token_hour_data(
//   token_addresses,
//   collection_name,
//   retrieve_latest = true,
//   hour_interval = 48
// ) {
//   const db = await mongodb.connect_db();
//   const collection = await mongodb.get_collection(db, collection_name);

//   for (const token_address of token_addresses) {
//     let start_timestamp = timestamp.current();
//     let end_timestamp = Date.now();
//     console.log(
//       chalk.cyan(`Downloading token hour data for token ${token_address}`)
//     );
//     while (uniswap_start_timestamp < end_timestamp) {
//       const data = await request_token_hour_data(
//         token_address,
//         parseInt(start_timestamp / 1000),
//         parseInt(end_timestamp / 1000)
//       );
//       const insert_status = await insert_data_unique_id(collection, data);
//       var date = new Date(start_timestamp);
//       console.log(
//         `${date.toUTCString()}     count: ${
//           insert_status.data_count
//         }     inserted: ${insert_status.inserted_count}`
//       );
//       if (
//         retrieve_latest &&
//         insert_status.inserted_count === 0 &&
//         insert_status.data_count != 0
//       ) {
//         break;
//       }
//       end_timestamp = start_timestamp;
//       start_timestamp = timestamp.add_hours(start_timestamp, -hour_interval);
//     }
//   }

//   mongodb.close_client();
// }

module.exports = {
  scrape_token_day_data: scrape_token_day_data,
  scrape_token_hour_data: scrape_token_hour_data,
};
