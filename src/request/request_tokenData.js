require("dotenv").config();
const { request } = require("graphql-request");

const TOKEN_DAY_DATA_QUERY = require("../graphql/tokenDayDatas_query");
const TOKEN_HOUR_DATA_QUERY = require("../graphql/tokenHourDatas_query");
const UNI_SUBGRAPH_ENDPOINT = process.env.UNISWAP_SUBGRAPH_ENDPOINT;

async function request_token_day_data(
  token_address,
  start_timestamp,
  end_timestamp
) {
  const params = {
    token_address: token_address,
    start_timestamp: start_timestamp,
    end_timestamp: end_timestamp,
  };
  const data = await request(
    UNI_SUBGRAPH_ENDPOINT,
    TOKEN_DAY_DATA_QUERY,
    params
  );
  return data.tokenDayDatas;
}

async function request_token_hour_data(
  token_address,
  start_timestamp,
  end_timestamp
) {
  const params = {
    token_address: token_address,
    start_timestamp: start_timestamp,
    end_timestamp: end_timestamp,
  };
  const data = await request(
    UNI_SUBGRAPH_ENDPOINT,
    TOKEN_HOUR_DATA_QUERY,
    params
  );
  return data.tokenHourDatas;
}

module.exports = {
  request_token_day_data: request_token_day_data,
  request_token_hour_data: request_token_hour_data,
};
