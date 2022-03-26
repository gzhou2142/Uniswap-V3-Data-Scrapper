const chalk = require("chalk");
const {
  connect_db,
  close_client,
  get_collection,
} = require("../mongodb/connect_mongo");

const {
  get_current_day_timestamp,
  day_to_timestamp,
  get_previous_day_timestamp,
  add_hours_timestamp,
} = require("../utils/timestamps");

const {
  request_position_snapshot,
} = require("../request/request_positionSnapshot");

const { insert_data_unique_id } = require("../mongodb/insert_data");
const uniswap_start_timestamp = day_to_timestamp(2021, 5, 1);

async function scrape_position_snapshot_data(
  pool_address,
  collection_name,
  scrape_missing = true,
  scrape_hour_interval = 6
) {
  const db = await connect_db();
  const collection = await get_collection(db, collection_name);
  // let start_timestamp = get_current_day_timestamp();
  // let end_timestamp = Date.now();

  let end_timestamp = Date.UTC(2021, 11 - 1, 20, 0, 0, 0);
  let start_timestamp = get_previous_day_timestamp(end_timestamp);
  console.log(
    chalk.cyan(`Downloading position snapshots for pool ${pool_address}`)
  );

  while (uniswap_start_timestamp < end_timestamp) {
    const data = await request_position_snapshot(
      pool_address,
      start_timestamp / 1000,
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
      -1 * scrape_hour_interval
    );
  }
  close_client();
}

module.exports = {
  scrape_position_snapshot_data: scrape_position_snapshot_data,
};
