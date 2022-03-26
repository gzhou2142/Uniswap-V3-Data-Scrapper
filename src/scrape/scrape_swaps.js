const chalk = require("chalk");

const {
  connect_db,
  close_client,
  get_collection,
} = require("../mongodb/connect_mongo");
const {
  get_current_day_timestamp,
  day_to_timestamp,
  add_hours_timestamp,
} = require("../utils/timestamps");

const { request_swap_data } = require("../request/request_swapData");
const { insert_data_unique_id } = require("../mongodb/insert_data");
const uniswap_start_timestamp = day_to_timestamp(2021, 5, 1);

async function scrape_swap_data(
  pool_address,
  collection_name,
  scrape_missing = true,
  scrape_hour_interval = 2
) {
  const db = await connect_db();
  const collection = await get_collection(db, collection_name);

    let d = new Date(Date.now());
    d.setUTCHours(0, 0, 0, 0);
    d.setUTCDate(d.getUTCDate() + 1);
    let end_timestamp = d.getTime();
  let start_timestamp = add_hours_timestamp(
    end_timestamp,
    -scrape_hour_interval
  );

//   let end_timestamp = Date.UTC(2021, 5 - 1, 20, 0, 0, 0);
//   let start_timestamp = add_hours_timestamp(
//     end_timestamp,
//     -scrape_hour_interval
//   );

  while (uniswap_start_timestamp < end_timestamp) {
    const data = await request_swap_data(
      pool_address,
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
      scrape_missing &&
      insert_status.inserted_count === 0 &&
      insert_status.data_count != 0
    ) {
      break;
    }
    end_timestamp = start_timestamp;
    start_timestamp = add_hours_timestamp(
      start_timestamp,
      -scrape_hour_interval
    );
  }
  close_client();
}

module.exports = {
  scrape_swap_data: scrape_swap_data,
};
