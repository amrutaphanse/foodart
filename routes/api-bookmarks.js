var express = require('express'),
    router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/foodart');

router.post('/add', function(req, res){
    var collection = db.get('bookmarks');
    var bookmark = {};
    bookmark.author = 'amruta12';
    bookmark.title = req.body.title;
    bookmark.url = req.body.url;
    bookmark.tags = extract_tags(req.body.tags);
    bookmark.search_tags = extract_tags(req.body.search_tags);
    bookmark.public = req.body.isPublic === "true" ? true : false;

    collection.insert(bookmark, function(err, bookmark){
        if (err) throw err;

        res.json(bookmark);
    });
});

router.get('/', function(req, res) {
    var collection = db.get('bookmarks');
    collection.find({}, function(err, data){
        if (err) throw err;
      	res.json(data);
    });
});

router.get('/:tag', function(req, res) {
    var tag = req.params.tag;
    var collection = db.get('bookmarks');
    collection.find({'tags':tag}, {"sort" : [['date', 'asc']]}, function(err, items) {
        if (err) throw err;
      	res.json(items);
    });
});


function extract_tags(tags) {
    "use strict";
    var cleaned = [];
    var tags_array = tags.split(',');
    for (var i = 0; i < tags_array.length; i++) {
        if ((cleaned.indexOf(tags_array[i]) == -1) && tags_array[i] != "") {
            cleaned.push(tags_array[i].replace(/\s/g,'-'));
        }
    }
    return cleaned;
}

module.exports = router;
