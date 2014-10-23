var http = require('http');
var cheerio = require('cheerio');

var urls = {
  js: 'http://javascriptweekly.com/issues/{{issue}}',
  css: 'http://css-weekly.com/issue-{{issue}}/'
};

var issues = {
  js: 203,
  css: 132
};

function getUrl(kind) {
  return urls[kind].replace(/{{issue}}/, issues[kind]);
}

function getHTML() {
  http.get(getUrl('js'), function (req) {
    var data = null;

    req.setEncoding('utf8');
    req.on('data', function (d) {
      data += d;
    });

    req.on('end', function () {
      var result = perseHTML(data);
      console.log(result);
    });
  });
}

function perseHTML(html) {
  var $ = cheerio.load(html);
  var items = $('table.container tr > td > table.gowide td');
  var r = [];
  items.each(function (i, elem) {
    if (i < 2) return;
    r.push($(this).html());
  });
  return r;
}

getHTML();
