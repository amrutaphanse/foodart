var querystring = require('querystring'),
    OAuth = require('oauth').OAuth,
    config = require('./config.json');

function Client() {
  this.oauthToken = config.token;
  this.oauthTokenSecret = config.token_secret;

  this.oauth = new OAuth(
    null,
    null,
    config.consumer_key,
    config.consumer_secret,
    config.version || "1.0",
    null,
    'HMAC-SHA1'
  );

  return this;
};

var base_url = "http://api.yelp.com/v2/";

Client.prototype.get = function(resource, params, callback) {
  return this.oauth.get(
    base_url + resource + '?' + querystring.stringify(params),
    this.oauthToken,
    this.oauthTokenSecret,
    function(error, data, response) {
      if(!error) data = JSON.parse(data);
      callback(error, data, response);
    }
  );
}

/*
Exampe:
yelp.search({term: "food", location: "Montreal"}, function(error, data) {});
*/
Client.prototype.search = function(params, callback) {
  return this.get('search', params, callback);
}

/*
Example:
yelp.business("yelp-san-francisco", function(error, data) {});
*/
Client.prototype.business = function(id, callback) {
  return this.get('business/' + id, null, callback);
}

/*
Exampe:
yelp.phone_search({phone: "+12223334444"}, function(error, data) {});
*/
Client.prototype.phone_search = function(params, callback) {
  return this.get('phone_search', params, callback);
}

// @see http://www.yelp.com/developers/documentation/v2/authentication
module.exports.createClient = function() {
  return new Client();
};
