require("dotenv").config();
const { request } = require("graphql-request");

const POSITION_DATA_QUERY = require("../graphql/positions_query");

const UNI_SUBGRAPH_ENDPOINT = process.env.UNISWAP_SUBGRAPH_ENDPOINT;

async function request_position_data(pool_address, start_id, end_id) {
  const step_size = 50;
  let skip_size = 0;
  let last_data_size = 0;
  let data_arr = [];
  do {
    let params = {
      pool_address: pool_address,
      start_id: start_id,
      end_id: end_id,
      first: step_size,
      skip: skip_size,
    };
    const data = await request(
      UNI_SUBGRAPH_ENDPOINT,
      POSITION_DATA_QUERY,
      params
    );
    last_data_size = data.positions.length;
    data_arr = data_arr.concat(data.positions);
    skip_size += step_size;
  } while (last_data_size === step_size);
  return data_arr;
}

module.exports = {
  request_position_data: request_position_data,
};
