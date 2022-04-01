async function insert_data_unique_id(collection, data) {
  let insert_count = 0;
  for (let i = 0; i < data.length; i++) {
    let data_i = data[i];
    const update_result = await collection.updateOne(
      { id: data_i.id },
      {$set: data_i},
      { upsert: true }
    );
    insert_count += update_result.upsertedCount;
  }
  return {
    data_count: data.length,
    inserted_count: insert_count,
  };
}

// async function replace_data_unique_id(collection, data) {
//   let insert_count = 0;
//   for (let i = 0; i < data.length; i++) {
//     let data_i = data[i];
//     const update_result = await collection.replaceOne(
//       { id: data_i.id },
//       data_i,
//       { upsert: true }
//     );
//     insert_count += update_result.upsertedCount;
//   }
//   return {
//     data_count: data.length,
//     inserted_count: insert_count,
//   };
// }

module.exports = {
  insert_data_unique_id: insert_data_unique_id,
};
