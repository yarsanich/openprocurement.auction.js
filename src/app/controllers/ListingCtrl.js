export default function ListingController($scope, $http) {
  /*@ngInject;*/

  let url = location.protocol + '//' + location.host + '/auctions/';
  let newLocation = url + '/_design/auctions/_view/by_endDate';
  $scope.url = location.protocol + '//' + location.host + '/tenders';
  $http({
    method: 'GET',
    url: newLocation,
    cache: true,
    params: {
      include_docs: true,
      startkey: (new Date()).getTime()
    },
  }).then(function(resp) {
    $scope.auctions = resp.data.rows;
  });

  //$scope.locateToTender = function(_id) {
  //  return location.protocol + '//' + location.host + location.pathname.replace('/list', '/tender'); 
  //};
}
