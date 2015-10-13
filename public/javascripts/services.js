angular.module('foodArtTravelApp.services', []).factory('foodArtTravelAPI', function($http) {

    var foodArtTravelAPI = {};

    foodArtTravelAPI.getRestaurants = function(zip, category, item) {
      return $http({
        method: 'GET',
        url: '/api/restaurants/'+ zip +'/' + category + '/' + item
      });
    }

    foodArtTravelAPI.getTrending = function(zip) {
      return $http({
        method: 'GET',
        url: '/api/restaurants/'+ zip
      });
    }

    foodArtTravelAPI.getBookmarks = function() {
      return $http({
        method: 'GET',
        url: '/api/bookmarks'
      });
    }
    foodArtTravelAPI.getBookmarksByTag = function(tag) {
      return $http({
        method: 'GET',
        url: '/api/bookmarks/'+  tag
      });
    }
    foodArtTravelAPI.saveBookmark = function(bookmark) {
      return $http({
        method: 'POST',
        url: '/api/bookmarks/add',
        data: bookmark
      });
    }

    return foodArtTravelAPI;
  });
