import angular from 'angular';
import ListingController from './controllers/ListingCtrl';


const requires = [
];


let app = angular.module('auction', requires);

app
  .controller('ListingController', ListingController);
