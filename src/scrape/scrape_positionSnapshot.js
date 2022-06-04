const mongodb = require("../mongodb/mongodb");
const timestamp = require("../utils/timestamp");

const {
  request_position_snapshot,
} = require("../request/request_positionSnapshot");
const {
  request_insert,
  auto_hour_interval,
  get_start_ts,
} = require("./scrape_utils");
const print = require("../utils/print");

async function scrape_position_snapshot_data(
  pool_address,
  collection_name,
  params
) {
  const retrieve_latest = params.retrieve_latest;
  const verbose = params.verbose;

  const db = await mongodb.connect_db();
  const collection = await mongodb.get_collection(db, collection_name);

  const query_params = {
    query: { "pool.id": pool_address },
    sort: { timestamp: -1 },
    ts_attribute: "timestamp",
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
  let hour_interval = 24;
  let prev_ts = timestamp.add_hours(start_ts, -3);
  let current_ts = start_ts;
  while (prev_ts <= end_ts) {
    const input = {
      pool_address: pool_address,
      start_timestamp: prev_ts,
      end_timestamp: current_ts,
    };
    const insert_status = await request_insert(
      request_position_snapshot,
      collection,
      input
    );
    if (!insert_status.success) {
      throw Error(
        `Failed to get position snapshot between timestamp ${previous_ts}-${current_ts}`
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
    print.total_insert_info(start_ts, Date.now(), total_data, total_insert);
  }
  mongodb.close_client();
}

module.exports = {
  scrape_position_snapshot_data: scrape_position_snapshot_data,
};
