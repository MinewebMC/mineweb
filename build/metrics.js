/*
var http = require('http'); // var is broke? HTTP might not work in the browser
 // but we need http 
// its for our statuspage metric
// Well you can proxy it if it doesn't. Is this being imported from anywhere and what does it do?
// https://developer.statuspage.io/#tag/metrics
// yeah this webpack dosent support this,i guess.

// The following 4 are the actual values that pertain to your account and this specific metric.
var apiKey = '660dedd2-6ae6-4ad6-ab41-cafc6f35494f' 
var pageId = 'g7h17n56xbtt';
var metricId = 'ws0pkm9gyk0r';
var apiBase = 'https://api.statuspage.io/v1'; //api base
 
var url = apiBase + '/pages/' + pageId + '/metrics/' + metricId + '/data.json';
var authHeader = { 'Authorization': 'OAuth ' + apiKey };
var options = { method: 'POST', headers: authHeader };
 
// Need at least 1 data point for every 5 minutes.
// Submit random data for the whole day.
var totalPoints = 60 / 5 * 24;
var epochInSeconds = Math.floor(new Date() / 1000);
 
// This function gets called every second.
function submit(count) {
  count = count + 1;
 
  if(count > totalPoints) return;
 
  var currentTimestamp = epochInSeconds - (count - 1) * 5 * 60;
  var randomValue = Math.floor(Math.random() * 1000);
 
  var data = {
    timestamp: currentTimestamp,
    value: randomValue, // check dicsord :P
  };
 
  var request = http.request(url, options, function (res) {
    res.on('data', function () {
      console.log('Submitted point ' + count + ' of ' + totalPoints);
    });
    res.on('end', function() {
      setTimeout(function() { submit(count); }, 1000);
    });
  });
 
  request.end(JSON.stringify({ data: data }));
}
 
// Initial call to start submitting data.
submit(0);
*/