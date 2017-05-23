import angular from '../lib/angular';
import ArchiveController from './controllers/ArchiveCtl';


const requires = [
];


let app = angular.module('auction', requires);

app
  .constant('AuctionConfig', {
    db_url:  window.db_url
  })
  .controller('ArchiveController',  ['AuctionConfig', '$scope', '$http', '$location', ArchiveController]);
