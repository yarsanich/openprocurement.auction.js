import angular from 'angular';
import ArchiveController from './controllers/ArchiveCtl';


const requires = [
];


let app = angular.module('auction', requires);

app
  .controller('ArchiveController', ArchiveController);
