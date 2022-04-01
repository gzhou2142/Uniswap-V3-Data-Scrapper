const { gql } = require("graphql-request");

//"0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8"
const tick_day_data_query = gql`
  query (
    $pool_address: String!
    $start_timestamp: Int!
    $end_timestamp: Int!
    $first: Int!
    $skip: Int!
  ) {
    tickDayDatas(
      where: {
        pool_starts_with: $pool_address
        date_gt: $start_timestamp
        date_lte: $end_timestamp
      }
      orderBy: date
      orderDirection: desc
      first: $first
      skip: $skip
    ) {
      id
      date
      pool {
        id
      }
      tick {
        tickIdx
        poolAddress
      }
      liquidityGross
      liquidityNet
      volumeToken0
      volumeToken1
      volumeUSD
      feesUSD
      feeGrowthOutside0X128
      feeGrowthOutside1X128
    }
  }
`;

module.exports = tick_day_data_query;
