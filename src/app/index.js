const requires = [
    'angular-growl',
    'GTMLogger'
];


angular.module('auction', requires).constant(
    'AuctionConfig', { db_url:  window.db_url
})
