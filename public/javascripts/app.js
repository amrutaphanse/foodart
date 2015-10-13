angular.module('foodArtTravelApp', [
  'foodArtTravelApp.services',
  'foodArtTravelApp.controllers',
  'ngRoute'
]).
config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/', {
    templateUrl: '/partials/restaurants-main.html',
    controller: 'formRestaurantController'
  });

	$routeProvider.when('/restaurants/:zip?', {
    templateUrl: '/partials/restaurant-form.html',
    controller: 'formRestaurantFoodController'});

  $routeProvider.when('/add-bookmark', {
    templateUrl: '/partials/newbookmark.html',
    controller: 'newBookmarkController'
  });

  $routeProvider.when('/bookmarks', {
    templateUrl: '/partials/bookmarks.html',
    controller: 'bookmarksController'
  });
  $routeProvider.when('/bookmarks/:tag', {
    templateUrl: '/partials/bookmarks.html',
    controller: 'bookmarksController'
  });

}]);
