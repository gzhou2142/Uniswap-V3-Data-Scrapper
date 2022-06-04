const { gql } = require("graphql-request");

//"0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8"
const pool_day_data_query = gql`
  query ($pool_address: String!, $start_timestamp: Int!, $end_timestamp: Int!) {
    poolDayDatas(
      where: {
        pool_starts_with: $pool_address
        date_gt: $start_timestamp
        date_lte: $end_timestamp
      }
      orderBy: date
      orderDirection: desc
    ) {
      id
      pool {
        id
        token0 {
          id
          name
        }
        token1 {
          id
          name
        }
        feeTier
      }
      date
      liquidity
      sqrtPrice

      token0Price
      token1Price
      tick

      feeGrowthGlobal0X128
      feeGrowthGlobal1X128

      volumeToken0
      volumeToken1
      volumeUSD
      
      tvlUSD
      feesUSD

      txCount

      high
      low
      open
      close
    }
  }
`;

module.exports = pool_day_data_query;
