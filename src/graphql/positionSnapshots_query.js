const { gql } = require("graphql-request");

//"0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8"
const positionSnapshot_data_query = gql`
  query (
    $pool_address: String!
    $start_timestamp: Int!
    $end_timestamp: Int!
    $first: Int!
    $skip: Int!
  ) {
    positionSnapshots(
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
      owner
      pool {
        id
      }
      blockNumber
      timestamp
      liquidity

      depositedToken0
      depositedToken1
      withdrawnToken0
      withdrawnToken1
      collectedFeesToken0
      collectedFeesToken1
      feeGrowthInside0LastX128
      feeGrowthInside1LastX128

      transaction {
        id
        blockNumber
        timestamp
        gasUsed
        gasPrice
      }

      position {
        id
        tickLower {
          id
          tickIdx
        }
        tickUpper {
          id
          tickIdx
        }
      }
    }
  }
`;

module.exports = positionSnapshot_data_query;
