const chalk = require("chalk");

function get_date_str(timestamp) {
  const dateObj = new Date(timestamp);
  const month = dateObj.getUTCMonth() + 1;
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear().toString().slice(2);
  return month + "/" + day + "/" + year;
}

function pool_collection_info(collection_name, pool_address) {
  console.log(
    chalk.white(
      `Downloading ${chalk.green(collection_name)} for pool ${chalk.green(
        pool_address
      )}`
    )
  );
}

function token_collection_info(collection_name, token_address) {
  console.log(
    chalk.white(
      `Downloading ${chalk.green(collection_name)} for token ${chalk.green(
        token_address
      )}`
    )
  );
}

function insert_info(timestamp, insert_status) {
  var date = new Date(timestamp);
  console.log(
    `${date.toUTCString()}     count: ${
      insert_status.data_count
    }     inserted: ${insert_status.inserted_count}`
  );
}

function total_insert_info(
  start_timestamp,
  end_timestamp,
  total_data_count,
  total_insert_count
) {
  console.log(
    chalk.cyan(
      `Counts: ${total_data_count}     Inserts: ${total_insert_count}     ${new Date(
        start_timestamp
      ).toUTCString()} - ${new Date(end_timestamp).toUTCString()}`
    )
  );
}

function request_error(collection_name, num_tries, input) {
  console.log(
    chalk.yellow(
      `Failed ${num_tries} tries to collect data for ${collection_name} with input ${chalk.red(
        JSON.stringify(input, undefined, 2)
      )}`
    )
  );
}

function red(text) {
  console.log(chalk.red(text));
}

module.exports = {
  pool_collection_info,
  token_collection_info,
  insert_info,
  total_insert_info,
  request_error,
  red,
};
