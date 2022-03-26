const { gql } = require("graphql-request");

//"0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8"
const pools_data_query = gql`
  query (
    $start_timestamp: Int!
    $end_timestamp: Int!
    $first: Int!
    $skip: Int!
  ) {
    pools(
      where: {
        createdAtTimestamp_gt: $start_timestamp
        createdAtTimestamp_lte: $end_timestamp
      }
      orderBy: createdAtTimestamp
      orderDirection: desc
      first: $first
      skip: $skip
    ) {
      id
      createdAtTimestamp
      createdAtBlockNumber
      feeTier
      token0 {
        id
        symbol
        name
        decimals
      }
      token1 {
        id
        symbol
        name
        decimals
      }
    }
  }
`;

module.exports = pools_data_query;
