const { gql } = require("graphql-request");

//"0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8"
const tick_day_data_query = gql`
  query ($first: Int!, $skip: Int!, $pool_address: String!, $date: Int!) {
    tickDayDatas(
      where: { pool_starts_with: $pool_address, date: $date }
      orderBy: date
      orderDirection: desc
      first: $first
      skip: $skip
    ) {
      id
      date
      tick {
        tickIdx
        poolAddress
      }
      liquidityGross
      liquidityNet
      feeGrowthOutside0X128
      feeGrowthOutside1X128
    }
  }
`;

module.exports = tick_day_data_query;
