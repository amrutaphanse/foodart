var AYLIENTextAPI = require('aylien_textapi'),
  config = require('./config.json');;

var textapi = new AYLIENTextAPI({
    application_id:config.aylien_app_id,
    application_key: config.aylien_key
  });


var analyse = function(reviews, callback) {
  var response = {};

  if(Array.isArray(reviews)){
      var positive = 0,
          negative = 0,
          neutral = 0;
      reviews.forEach(function(review){

          textapi.sentiment({'text':review.text}, function(err, response){
             if(err === null){
                if(response && response.polarity){
                  if(response.polarity === 'positive'){
                      positive++;
                  }else if(response.polarity === 'negative'){
                      negative++;
                  }else{
                      neutral++;
                  }
                }else{
                   neutral++;
                }
             }else{
                neutral++;
             }
          });
      });
      var max = Math.max(positive, negative, neutral);
      response.review = 0;
      if(max === positive){
        response.review = 1;
      }else if(max === negative){
        response.review = -1;
      }
      callback(null, response);

  }else if(typeof reviews === 'string'){
    response.review = 0;
    textapi.sentiment({'text':reviews}, function(err, response){
       if(err === null){
          if(response && response.polarity){
            if(response.polarity === 'positive'){
                response.review = 1
            }else if(response.polarity === 'negative'){
                response.review = -1;
            }
            callback(null, response);
          }
       }else{
          callback(err, response);
       }
    });
  }else{
    response.review = 0;
    callback(null, response);
  }
};

module.exports = analyse;
