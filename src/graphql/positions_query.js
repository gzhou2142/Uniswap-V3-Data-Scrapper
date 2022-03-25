const { gql } = require("graphql-request");

//"0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8"
const positions_query = gql`
  query (
    $pool_address: String!
    $start_id: String!
    $end_id: String!
    $first: Int!
    $skip: Int!
  ) {
    positions(
      where: {
        pool_starts_with: $pool_address
        id_gte: $start_id
        id_lte: $end_id
      }
      orderBy: id
      orderDirection: desc
      first: $first
      skip: $skip
    ) {
      id
      owner
      pool {
        id
      }
      token0 {
        id
      }
      token1 {
        id
      }
      tickLower {
        id
        tickIdx
      }
      tickUpper {
        id
        tickIdx
      }
      liquidity
      depositedToken0
      depositedToken1
      withdrawnToken0
      withdrawnToken1
      collectedFeesToken0
      collectedFeesToken1
      transaction {
        id
        blockNumber
        timestamp
        gasUsed
        gasPrice
      }
      feeGrowthInside0LastX128
      feeGrowthInside1LastX128
    }
  }
`;

module.exports = positions_query;
