import angular from '../lib/angular';
import ListingController from './controllers/ListingCtrl';


const requires = [
];


let app = angular.module('auction', requires);

app
  .constant('AuctionConfig', {
    db_url:  window.db_url
  })
  .controller('ListingController', ['AuctionConfig', '$scope', '$http', ListingController]);
