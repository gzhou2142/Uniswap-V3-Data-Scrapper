function day_to_timestamp(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  return date.getTime();
}

function timestamp_to_day(timestamp) {
  const date = new Date(timestamp);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

function get_current_day_timestamp() {
  return Math.floor(Math.floor(Date.now() / 1000) / 86400) * 86400 * 1000;
}

function get_previous_day_timestamp(timestamp) {
  var ts = Math.floor(Math.floor(timestamp / 1000) / 86400) * 86400;
  ts = ts - 86400;
  return parseInt(ts * 1000);
}

function add_hours_timestamp(timestamp, hours) {
  return timestamp + hours * 60 * 60 * 1000;
}

module.exports = {
  day_to_timestamp: day_to_timestamp,
  timestamp_to_day: timestamp_to_day,
  get_current_day_timestamp: get_current_day_timestamp,
  get_previous_day_timestamp: get_previous_day_timestamp,
  add_hours_timestamp: add_hours_timestamp,
};
