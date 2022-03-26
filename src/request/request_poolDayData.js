require("dotenv").config();
const { request } = require("graphql-request");

const POOL_DAY_DATA_QUERY = require("../graphql/poolDayDatas_query");
const UNI_SUBGRAPH_ENDPOINT = process.env.UNISWAP_SUBGRAPH_ENDPOINT;

async function request_pool_day_data(pool_address, timestamp) {
  const params = {
    pool_address: pool_address,
    date: timestamp,
  };
  const data = await request(
    UNI_SUBGRAPH_ENDPOINT,
    POOL_DAY_DATA_QUERY,
    params
  );
  return data.poolDayDatas;
}

module.exports = {
  request_pool_day_data: request_pool_day_data,
};
