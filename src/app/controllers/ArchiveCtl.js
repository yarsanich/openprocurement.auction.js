export default function ArchiveController($scope, $http, $location) {
  /*@ngInject;*/
  let startid = false;

  let params = $location.search();
  console.log(params);

  let offset = params.offset || (new Date()).getTime() * 1000;
  let startkey_docid = params.startid || '';

  let url = location.protocol + '//' + location.host + '/auctions'; 
  let newLocation = url + '/_design/auctions/_view/by_endDate';
  $http({
    method: 'GET',
    url: newLocation,
    cache: true,
    params: {
      include_docs: true,
      startkey: offset,
      startkey_docid: startkey_docid,
      limit: 101,
      descending: true,
    },
  }).then(function(resp) {
    $scope.auctions = resp.data.rows;
  });

  offset = false;

  if (($scope.auctions || []).lenght > 100) {
    offset = $scope.auctions[100].key;
    startid = $scope.auctions[100].id;
  }
  $scope.offset = offset;
  $scope.startid = startid;
}
