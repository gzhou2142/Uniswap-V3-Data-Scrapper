require("dotenv").config();
const { request } = require("graphql-request");

const POOL_DATA_QUERY = require("../graphql/pools_query");
const POOL_HOUR_DATA_QUERY = require("../graphql/poolHourDatas_query");
const POOL_DAY_DATA_QUERY = require("../graphql/poolDayDatas_query");
const UNI_SUBGRAPH_ENDPOINT = process.env.UNISWAP_SUBGRAPH_ENDPOINT;

async function request_pool_data(start_timestamp, end_timestamp) {
  const step_size = 50;
  let skip_size = 0;
  let last_data_size = 0;
  let data_arr = [];
  do {
    const params = {
      start_timestamp: start_timestamp,
      end_timestamp: end_timestamp,
      first: step_size,
      skip: skip_size,
    };
    const data = await request(UNI_SUBGRAPH_ENDPOINT, POOL_DATA_QUERY, params);
    last_data_size = data.pools.length;
    data_arr = data_arr.concat(data.pools);
    skip_size += step_size;
  } while (last_data_size === step_size);

  return data_arr;
}

async function request_pool_hour_data(
  pool_address,
  start_timestamp,
  end_timestamp
) {
  const params = {
    pool_address: pool_address,
    start_timestamp: start_timestamp,
    end_timestamp: end_timestamp,
  };
  const data = await request(
    UNI_SUBGRAPH_ENDPOINT,
    POOL_HOUR_DATA_QUERY,
    params
  );
  return data.poolHourDatas;
}

async function request_pool_day_data(
  pool_address,
  start_timestamp,
  end_timestamp
) {
  const params = {
    pool_address: pool_address,
    start_timestamp: start_timestamp,
    end_timestamp: end_timestamp,
  };
  const data = await request(
    UNI_SUBGRAPH_ENDPOINT,
    POOL_DAY_DATA_QUERY,
    params
  );
  return data.poolDayDatas;
}

module.exports = {
  request_pool_data: request_pool_data,
  request_pool_hour_data: request_pool_hour_data,
  request_pool_day_data: request_pool_day_data,
};
