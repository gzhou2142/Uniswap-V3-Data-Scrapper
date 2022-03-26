require("dotenv").config();
const { MongoClient } = require("mongodb");
const chalk = require("chalk");

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
  console.log("\n");
}

function get_collection(db, collection_name) {
  return db.collection(collection_name);
}

module.exports = {
  connect_db: connect_db,
  close_client: close_client,
  get_collection: get_collection,
};
