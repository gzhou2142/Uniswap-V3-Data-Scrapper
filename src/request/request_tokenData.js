require("dotenv").config();
const { request } = require("graphql-request");

const TOKEN_DAY_DATA_QUERY = require("../graphql/tokenDayDatas_query");
const TOKEN_HOUR_DATA_QUERY = require("../graphql/tokenHourDatas_query");
const UNI_SUBGRAPH_ENDPOINT = process.env.UNISWAP_SUBGRAPH_ENDPOINT;

async function request_token_day_data(input) {
  const params = {
    token_address: input.token_address,
    start_timestamp: parseInt(input.start_timestamp / 1000),
    end_timestamp: parseInt(input.end_timestamp / 1000),
  };
  const data = await request(
    UNI_SUBGRAPH_ENDPOINT,
    TOKEN_DAY_DATA_QUERY,
    params
  );
  return data.tokenDayDatas;
}

async function request_token_hour_data(input) {
  const params = {
    token_address: input.token_address,
    start_timestamp: parseInt(input.start_timestamp / 1000),
    end_timestamp: parseInt(input.end_timestamp / 1000),
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
