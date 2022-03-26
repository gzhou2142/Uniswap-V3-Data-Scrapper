const { gql } = require("graphql-request");

//"0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8"
const pool_day_data_query = gql`
  query ($pool_address: String!, $date: Int!) {
    poolDayDatas(
      where: { pool_starts_with: $pool_address, date: $date }
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

module.exports = pool_day_data_query

