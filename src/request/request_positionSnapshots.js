require("dotenv").config();
const { request } = require("graphql-request");

const POSITION_SNAPSHOTS_QUERY = require("../graphql/positionSnapshots_query");

const UNI_SUBGRAPH_ENDPOINT = process.env.UNISWAP_SUBGRAPH_ENDPOINT;

async function request_position_snapshot(
  pool_address,
  start_timestamp,
  end_timestamp
) {
  const step_size = 50;
  let skip_size = 0;
  let last_data_size = 0;
  let data_arr = [];
  do {
    let params = {
      pool_address: pool_address,
      start_timestamp: start_timestamp,
      end_timestamp: end_timestamp,
      first: step_size,
      skip: skip_size,
    };
    const data = await request(
      UNI_SUBGRAPH_ENDPOINT,
      POSITION_SNAPSHOTS_QUERY,
      params
    );
    last_data_size = data.positionSnapshots.length;
    data_arr = data_arr.concat(data.positionSnapshots);
    skip_size += step_size;
  } while (last_data_size === step_size);
  return data_arr;
}

module.exports = {
  request_position_snapshot: request_position_snapshot,
};
