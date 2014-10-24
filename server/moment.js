var moment = require('moment');
var outputFormat = 'YYYY-MM-DD HH:mm:ss';

/**
 * @param object
 * @return string
 *
 * example
 * var hatena = {
 *   time: '2014-10-23T23:38:18+09:00',
 *   format: 'YYYY-MM-DD HH:mm:ss Z'
 * }
 * var twitter = {
 *   time: 'Oct 23 22:21:34 +0000 2014', 
 *   format: 'MMM DD HH:mm:ss Z'
 * }
 *
 */
function formatTime(date) {
  return moment(date.time, date.format).format(outputFormat);
}

module.exports = formatTime;
