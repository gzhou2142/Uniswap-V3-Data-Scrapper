require("dotenv").config();
const { request } = require("graphql-request");

const POOL_DAY_DATA_QUERY = require("../graphql/pool_data_query");
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

// async function main() {
//   const data = await request_pool_day_data(
//     "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8",
//     1647648000
//   );
//   console.log(data);
// }
// main();

module.exports = {
    request_pool_day_data: request_pool_day_data
}