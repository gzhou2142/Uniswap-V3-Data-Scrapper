require("dotenv").config();
const { request } = require("graphql-request");

const TICK_DATA_QUERY = require("../graphql/tickDayDatas_query");

const UNI_SUBGRAPH_ENDPOINT = process.env.UNISWAP_SUBGRAPH_ENDPOINT;

async function request_tick_data(pool_address, date, first = 10, skip = 0) {
  const params = {
    first: first,
    skip: skip,
    date: date,
    pool_address: pool_address,
  };
  const data = await request(UNI_SUBGRAPH_ENDPOINT, TICK_DATA_QUERY, params);
  return data.tickDayDatas;
}

async function request_tick_data_timestamp(pair_address, timestamp) {
  const step_size = 100;
  let skip_size = 0;
  let last_data_size = 0;
  let tick_data = [];
  do {
    const data = await request_tick_data(
      pair_address,
      timestamp,
      step_size,
      skip_size
    );

    last_data_size = data.length;
    tick_data = tick_data.concat(data);
    skip_size += step_size;
  } while (last_data_size === step_size);

  return tick_data;
}

module.exports = {
  request_tick_data: request_tick_data,
  request_tick_data_timestamp: request_tick_data_timestamp,
};
