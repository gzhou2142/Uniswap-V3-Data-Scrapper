const { gql } = require("graphql-request");

//"0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8"
const burns_data_query = gql`
  query (
    $pool_address: String!
    $start_timestamp: Int!
    $end_timestamp: Int!
    $first: Int!
    $skip: Int!
  ) {
    burns(
      where: {
        pool: $pool_address
        timestamp_gt: $start_timestamp
        timestamp_lte: $end_timestamp
      }
      orderBy: timestamp
      orderDirection: desc
      first: $first
      skip: $skip
    ) {
      id
      transaction {
        id
        blockNumber
        timestamp
        gasUsed
        gasPrice
      }
      pool {
        id
      }
      owner
      origin
      amount
      amount0
      amount1
      amountUSD
      tickLower
      tickUpper
    }
  }
`;

module.exports = burns_data_query;
