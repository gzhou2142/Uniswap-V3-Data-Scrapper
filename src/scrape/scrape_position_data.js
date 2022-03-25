const chalk = require("chalk");
const {
  connect_db,
  close_client,
  get_collection,
} = require("../mongodb/connect_mongo");

const { request_position_data } = require("../request/request_positionData");
const { insert_data_unique_id } = require("../mongodb/insert_data");
const { get_total_supply } = require("../position_nft/get_total_supply");

function get_request_order(start, end, interval) {
  let arr = [];
  for (let i = start; i < end; i++) {
    arr.push(i.toString());
  }
  const sorted_arr = arr.sort();
  let request_order = [];
  for (let i = 0; i < sorted_arr.length; i += interval) {
    if (i + interval <= sorted_arr.length - 1) {
      let order_arr = sorted_arr.slice(i, i + interval);
      let order = [order_arr[0], order_arr[order_arr.length - 1]];
      request_order.push(order);
    } else {
      let order_arr = sorted_arr.slice(i);
      let order = [order_arr[0], order_arr[order_arr.length - 1]];
      request_order.push(order);
    }
  }
  return request_order.reverse();
}

async function scrape_position_data(
  pool_address,
  collection_name,
  scrape_missing = true
) {
  const db = await connect_db();
  //   const collection = await get_collection(db, collection_name);
  const collection = await get_collection(db, "mintData");
  const distinctOrigin = await collection.distinct(
    "origin",
    {},
    { collation: { locale: "en_US" } }
  );
  //   const test = await collection.findOne({});
  //   console.log(test);
  console.log(distinctOrigin);
  //   const total_supply = await get_total_supply();
  //   const request_order = get_request_order(211538, Number(total_supply), 600);

  //   let total_insert = 0;
  //   let total_count = 0;
  //   console.log(chalk.cyan(`Downloading position data for pool ${pool_address}`));
  //   let i = 0;
  //   while (i < request_order.length) {
  //     const start_id = request_order[i][0];
  //     const end_id = request_order[i][1];
  //     const data = await request_position_data(pool_address, start_id, end_id);
  //     i += 1;
  //     if (data.length === 0) {
  //       console.log(`Position ID Range (${start_id}-${end_id})     count: 0`);
  //       continue;
  //     }

  //     const insert_status = await insert_data_unique_id(collection, data);
  //     console.log(
  //       `Position ID Range (${start_id}-${end_id})     count: ${insert_status.data_count}     inserted: ${insert_status.inserted_count}`
  //     );
  //     total_insert += insert_status.inserted_count;
  //     total_count += data.length;
  //     if (scrape_missing && insert_status.inserted_count === 0) {
  //       break;
  //     }
  //   }
  //   console.log(`Total Insert: ${total_insert}    Total Count: ${total_count}`);

  close_client();
}

module.exports = {
  scrape_position_data: scrape_position_data,
};
// function test() {
//   let arr = [];
//   for (let i = 1; i < 200000; i++) {
//     arr.push(i.toString());
//   }
//   return arr.sort();
// }

// async function main() {
//   console.log(test()[0]);
//   let l = test().slice(0, 100);
//   console.log(l[0]);
//   console.log(l[l.length - 1]);
//   const supply = await get_total_supply();
// }
