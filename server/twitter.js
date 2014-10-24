var twitter = require('twitter');
var http = require('http');
var async = require('async');
var formatTime = require('./moment.js');
var config = require('./config.json').twitter;

var twit = new twitter({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token_key: config.access_token_key,
  access_token_secret: config.access_token_secret
});

function getListId(listName) {
  twit.get('/lists/list.json', function(data) {
    [].forEach.call(data, function(d) {
      if (d.name === listName) {
        getListTimeline(d.id);
      }
    });
  });
}

function getListTimeline (id) {
  var options = {
    include_entities: true,
    list_id: id,
    count: 5
  }
  twit.get('/lists/statuses.json', options, function(data) {
    async.each(data, function(tw, tweetcb) {
      perseTweet(tw, tweetcb);
    });
  });
}

function perseTweet(tw, tweetcb) {
  var result = {};
  async.series([
    function (done) {
      result.creator = tw.user.name;
      result.body = tw.text;
      result.retweetCount = tw.retweet_count;
      result.favoriteCount = tw.favorite_count;
      result.rewtweeted = tw.retweeted;

      var date = tw.created_at.slice(4);
      result.date = formatTime({time: date, format: 'MMM DD HH:mm:ss Z'});

      done();
    },
    function (done) {
      var urls = [];
      async.each(tw.entities.urls, function (url, cb) {
        longUrl(url.url, cb, function (url) {
          urls.push(url);
        });
      }, function (err) {
        result.urls = urls;
        done();
      });
    }
  ], function (err, results) {
    console.log(result);
    console.log('===');
    tweetcb();
  });
}

function longUrl(shortUrl, urlcb, cb) {
  var url;
  var api = 'http://api.longurl.org/v2/expand?url=' + shortUrl + '&format=json';

  http.get(api, function(res) {
    res.on('data', function(chunk) {
      url = JSON.parse(chunk)['long-url'];
      cb(url);
      urlcb();
    });
  });
}

var listName = 'web selection';
getListId(listName);
