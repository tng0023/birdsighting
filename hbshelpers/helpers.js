var moment = require('moment');

function dateFormat(date){
  m = moment.utc(date); //read date as utc
  //Identify the timezone in String
  return m.parseZone().format("dddd, MMMM Do YYYY, h:mm a");
}

var helpers = {
  dateFormatter: dateFormat
};

module.exports = helpers;
