const { gql } = require("graphql-request");

const token_hour_data_query = gql`
  query (
    $token_address: String!
    $start_timestamp: Int!
    $end_timestamp: Int!
  ) {
    tokenHourDatas(
      where: {
        token: $token_address
        periodStartUnix_gt: $start_timestamp
        periodStartUnix_lte: $end_timestamp
      }
      orderBy: periodStartUnix
      orderDirection: desc
    ) {
      id
      periodStartUnix
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

module.exports = token_hour_data_query;
