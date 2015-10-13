var qs = require('querystring'),
    config = require('./config.json'),
    util = require('util'),
    https = require('https'),
    urlParser = require('url'),
    path = require('path'),
    emptyCallback = function() { };

function FourSquareClient() {
  this.appId = config.foursquare_app_id;
  this.secret = config.foursquare_key;

  return this;
};

var base_url = "https://api.foursquare.com/v2";

function retrieve(url, callback, method) {
  callback = callback || emptyCallback;
  method = 'POST' === method ? 'POST' : 'GET';

  var parsedUrl = urlParser.parse(url, true), request, result = '';

  if(parsedUrl.protocol == 'https:' && !parsedUrl.port) {
    parsedUrl.port = 443;
  }

  if(parsedUrl.query === undefined) {
    parsedUrl.query = {};
  }
  var path = parsedUrl.pathname + '?' + qs.stringify(parsedUrl.query);

  var locale = config.locale || 'en';
  request = https.request({
    'host' : parsedUrl.hostname,
    'port' : parsedUrl.port,
    'path' : path,
    'method' : method,
    'headers' : {
      'Content-Length': 0,
      'Accept-Language': locale
    }
  }, function(res) {
    res.on('data', function(chunk) {
      result += chunk;
    });
    res.on('end', function() {
      callback(null, res.statusCode, result);
    });
  });
  request.on('error', function(error) {
    callback(error);
  });

  request.end();
}

function invokeApi(url, appid, secret, callback, method) {

    callback = callback || emptyCallback;
    method = 'POST' === method ? 'POST' : 'GET';

    var parsedUrl = urlParser.parse(url, true);

    parsedUrl.query.client_id = appid;
    parsedUrl.query.client_secret = secret;

    parsedUrl.query.v = "20151005";

    parsedUrl.search = '?' + qs.stringify(parsedUrl.query);
    url = urlParser.format(parsedUrl);

    retrieve(url,
      function(error, status, result) {
        if(error) {
          callback(error);
        }
        else {
          callback(null, status, result);
        }
      }, method);
  }

function extractData(url, id, status, result, callback) {
    var json;
    callback = callback || emptyCallback;

    if(status !== undefined && result !== undefined) {
      try {
        json = JSON.parse(result);
      }
      catch(e) {
        callback(e);
        return;
      }

      if(json.meta && json.meta.code === 200) {
        if(json.meta.errorType) {
            callback(new Error(message));
            return;
        }
        if(json.response !== undefined) {
          if(id){
            json.response.id = id;
          }

          callback(null, json.response);
        }
        else {
          callback(null, {});
        }
      }
      else if(json.meta) {
          callback(new Error(json.meta.code + ': ' + json.meta.errorDetail));
      }
      else {
          callback(new Error('Response had no code: ' + util.inspect(json)));
      }
    }
    else {
        callback(new Error('Foursquare had no response or status code.'));
    }
  }


FourSquareClient.prototype.callApi = function(path, id, params, callback, method) {

      if(!callback || typeof(callback) !== 'function') {
        throw new Error('callApi: callback not provided');
      }

      var url = base_url + path;

      if(params) {
        url += '?' + qs.stringify(params);
      }
      invokeApi(url, this.appId, this.secret, function(error, status, result) {
        extractData(url, id, status, result, callback);
      }, method);
    }

FourSquareClient.prototype.explore = function(near, params, callback) {

   params = params || {};

   if(!near) {
     callback(new Error('Venues.explore: lat and lng or near are both required.'));
     return;
   } else {
     params.near = near;
   }

   this.callApi('/venues/explore', null, params, callback);
 }

 FourSquareClient.prototype.trending = function(near, params, callback) {

    params = params || {};

    if(!near) {
      callback(new Error('Venues.trending: lat and lng or near are both required.'));
      return;
    } else {
      params.near = near;
    }

    this.callApi('/venues/trending', null, params, callback);
  }


 FourSquareClient.prototype.getVenueAspect = function(venueId, aspect, params, callback) {
  if (!venueId) {
    callback(new Error('Venues.getVenueAspect: venueId is required.'));
    return;
  }
  if (!aspect) {
    callback(new Error('Venues.getVenueAspect: aspect is required.'));
    return;
  }
  this.callApi(path.join('/venues', venueId, aspect),  venueId, params || {}, callback);
}


FourSquareClient.prototype.getTips = function(venueId, params, callback) {
    if (!venueId) {
      callback(new Error('Venues.getTips: venueId is required.'));
      return;
    }
    this.getVenueAspect(venueId, 'tips', params,  callback);
}

module.exports = FourSquareClient;
