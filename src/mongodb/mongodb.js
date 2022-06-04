require("dotenv").config();
const { MongoClient } = require("mongodb");

const MONGO_URL = process.env.MONGO_URL;
const client = new MongoClient(MONGO_URL);

const dbName = "Uniswap";

async function connect_db() {
  await client.connect();
  // console.log(chalk.green("Connected successfully to MongoDB server"));
  const db = client.db(dbName);
  return db;
}

async function close_client() {
  client.close();
  // console.log(chalk.yellow("Disconnected from MongoDB server"));
  // console.log("\n");
}

function get_collection(db, collection_name) {
  return db.collection(collection_name);
}

async function update_unique(collection, data) {
  let insert_count = 0;
  for (let i = 0; i < data.length; i++) {
    let data_i = data[i];
    const update_result = await collection.updateOne(
      { id: data_i.id },
      { $set: data_i },
      { upsert: true }
    );
    insert_count += update_result.upsertedCount;
  }
  return {
    data_count: data.length,
    inserted_count: insert_count,
  };
}

async function replace_unique(collection, data) {
  let insert_count = 0;
  for (let i = 0; i < data.length; i++) {
    let data_i = data[i];
    const update_result = await collection.replaceOne(
      { id: data_i.id },
      data_i,
      { upsert: true }
    );
    insert_count += update_result.upsertedCount;
  }
  return {
    data_count: data.length,
    inserted_count: insert_count,
  };
}

async function find_entry_sort(collection, query, sort) {
  var promise = () => {
    return new Promise((resolve, reject) => {
      collection
        .find(query)
        .sort(sort)
        .limit(1)
        .toArray(function (err, data) {
          err ? reject(err) : resolve(data[0]);
        });
    });
  };
  const entry = await promise();
  return entry;
}

module.exports = {
  connect_db,
  close_client,
  get_collection,
  update_unique,
  replace_unique,
  find_entry_sort,
};
