const { gql } = require("graphql-request");

const token_day_data_query = gql`
  query (
    $token_address: String!
    $start_timestamp: Int!
    $end_timestamp: Int!
  ) {
    tokenDayDatas(
      where: {
        token: $token_address
        date_gt: $start_timestamp
        date_lte: $end_timestamp
      }
      orderBy: date
      orderDirection: desc
    ) {
      id
      date
      token {
        id
        symbol
        name
        decimals
      }
      volume
      volumeUSD
      untrackedVolumeUSD
      totalValueLocked
      totalValueLockedUSD
      priceUSD
      feesUSD
      open
      high
      low
      close
    }
  }
`;

module.exports = token_day_data_query;
