var http = require('http');
var cheerio = require('cheerio');
var url = require('./config.json').hatena.url

http.get(url, function (res) {
  res.setEncoding('utf-8');
  var data;

  res.on('data', function (chunk) {
    data += chunk;
  });

  res.on('end', function () {
    var r = perseRss(data);
    console.log(r);
  });
})

function perseRss(data) {
  var $ = cheerio.load(data, {
    xmlMode: true
  });
  var result = [];

  $('item').each(function (i, elem) {
    var r = {};
    r.title = $(this).find('title').text();
    r.link = $(this).find('link').text();
    r.description = $(this).find('description').text();
    r.creator = $(this).find('dc\\:creator').text();
    r.date = $(this).find('dc\\:date').text();
    r.hatenaBookmarkCount = $(this).find('hatena\\:bookmarkcount').text();

    // article body
    var body = $(this).find('content\\:encoded').text();
    var p = $('cite + p + p', body).text();
    if (p === ' ') {
      var p = $('cite + p', body).text();
    }
    r.body = p;

    result.push(r);
  });

  return result;
}
