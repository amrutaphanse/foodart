var express = require('express'),
    async = require('async'),
    analyse = require('../lib/text-analysis')
    FoursquareClient = require('../lib/foursquare-client'),
    foursquare = new FoursquareClient();
;
var router = express.Router();

router.get('/:zipcode', function(req, res, next) {
  foursquare.trending(req.params.zipcode, {}, function(err, data){
        if (err) throw err;
        console.log(data);
        var filtered = data.venues.filter(function(business){
            return business.hasMenu && business.hasMenu === true;
        });
      	res.json(filtered);
  });
});


router.get('/:zipcode/:category/:item', function(req, res, next) {
  if(req.params.zipcode && req.params.category && req.params.item){
    foursquare.explore(req.params.zipcode, {"query": req.params.category + ' restaurants', "limit": 100}, function(err, data){
          if (err) throw err;
          getRelevantBusinesses(data.groups[0].items, req.params.item, function(err, results){

             if(!err && results && Array.isArray(results)){
                var filtered = data.groups[0].items.filter(function(business){
                    return results.indexOf(business.venue.id) > -1;
                });
                var unfiltered = data.groups[0].items.filter(function(business){
                    return results.indexOf(business.venue.id) == -1;
                });
                filtered.concat(unfiltered);
                res.json(filtered);
             }
          });

    });
  }else{
    throw err;
  }
});

function getRelevantBusinesses(data, item, callback){
  if(Array.isArray(data)){
      var tasks = [];

      data.forEach(function(business){
         var id = business.venue.id;

         tasks.push(function(cb){
            foursquare.getVenueAspect.call(foursquare, id, 'tips', {limit: 50}, cb);
         });
      });
      async.parallel(tasks, function(err, results){
        if(err){
          callback(err, null);
        }else{

          var responseArray = results.filter(function(result){
             var flag = false;
             if(result.tips && Array.isArray(result.tips.items)){
                result.tips.items.some(function(tip){
                    if(tip.text.toLowerCase().indexOf(item) > 0){
                      flag = true;
                      return true;
                    }
                });
             }
             if(flag === true){
                analyse(result.tips.items, function(err, response){
                   if(!err){
                     result.review = response.review;
                   }
                });
             }

             delete result.tips;
             return flag;
          });
          responseArray.sort(function(a,b){
            if(a.review > b.review){
               return -1;
            }else if(a.review < b.review){
              return 1;
            }
            return 0;
          });
          var newArr = responseArray.map(function(value){
              return value.id;
          });
          callback(err, newArr);
        }
      })

  }else{
      callback(err, null);
  }
}

module.exports = router;
