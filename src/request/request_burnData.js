require("dotenv").config();
const { request } = require("graphql-request");

const BURN_DATA_QUERY = require("../graphql/burns_query");

const UNI_SUBGRAPH_ENDPOINT = process.env.UNISWAP_SUBGRAPH_ENDPOINT;

async function request_burn_data(input) {
  const pool_address = input.pool_address;
  const start_timestamp = parseInt(input.start_timestamp / 1000);
  const end_timestamp = parseInt(input.end_timestamp / 1000);

  const step_size = 100;
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
    const data = await request(UNI_SUBGRAPH_ENDPOINT, BURN_DATA_QUERY, params);
    last_data_size = data.burns.length;
    data_arr = data_arr.concat(data.burns);
    skip_size += step_size;
  } while (last_data_size == step_size);
  return data_arr;
}

module.exports = {
  request_burn_data: request_burn_data,
};
