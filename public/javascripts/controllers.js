angular.module('foodArtTravelApp.controllers', ['ngCookies']).

  controller('formRestaurantController', ['$scope', '$cookies', '$location', '$timeout', function($scope, $cookies, $location, $timeout) {
    $scope.save = function() {
        $scope.showLoc = false;

        var zipcode = this.zipcode;
        $cookies.put('zip', zipcode);
        $scope.showLoc = true;
        $timeout(function () {
            $location.path('/restaurants/'+zipcode).replace();
        });


        return false;
    };

}])
.controller('newBookmarkController', ['$scope', 'foodArtTravelAPI', '$location', '$timeout', function($scope, foodArtTravelAPI, $location, $timeout) {
    $scope.submit = function() {
      foodArtTravelAPI.saveBookmark($scope.bookmark)
      .success(function (response) {

          $timeout(function () {
              $location.path('/bookmarks').replace();
          });
      });
      return false;
  };
}])
.controller('bookmarksController', ['$scope', 'foodArtTravelAPI', '$routeParams', function($scope, foodArtTravelAPI, $routeParams) {
  $scope.showData = false;
  if($routeParams.tag){
    foodArtTravelAPI.getBookmarksByTag($routeParams.tag)
    .success(function (response) {
        $scope.bookmarkList = response;
        $scope.showData = true;
    });
  }else{
    foodArtTravelAPI.getBookmarks()
    .success(function (response) {
        $scope.bookmarkList = response;
        $scope.showData = true;
    });
  }

}])
.controller('formRestaurantFoodController', ['$scope', '$cookies', 'foodArtTravelAPI', function($scope, $cookies, foodArtTravelAPI) {

    $scope.submit = function() {
      $scope.showData = false;
      $scope.showTrend = false;
      var category = this.category;
      var item = this.dish;
      var zipcode = $cookies.get('zip');
      this.category = '';
      this.item = '';

      foodArtTravelAPI.getRestaurants(zipcode, category, item)
      .success(function (response) {

          $scope.dish = item;
          $scope.category = category;
          $scope.restaurantList = response;
      });

      foodArtTravelAPI.getTrending(zipcode)
      .success(function (response) {


          $scope.trendsList = response;
          console.log($scope.trendsList);
          $scope.showData = true;
      });
      return false;

    };

  }]);
