const mongodb = require("../mongodb/mongodb");
const print = require("../utils/print");


async function request_insert(request_func, collection, input) {
  const max_tries = 10;
  let num_tries = 1;
  let success = false;
  let insert_status;
  while (num_tries <= max_tries) {
    try {
      const data = await request_func(input);
      insert_status = await mongodb.update_unique(collection, data);
      success = true;
      break;
    } catch (e) {
      print.request_error(collection.namespace, num_tries, input);
      print.red(e);
      num_tries += 1;
    }
  }
  return { success: success, ...insert_status };
}

module.exports = { request_insert: request_insert };
