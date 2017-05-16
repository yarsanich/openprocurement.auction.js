import angular from 'angular';

import AuctionController from './controllers/AuctionCtl';
import OffCanvasController from './controllers/OffCanvasCtl';
import nghReplace from './directives/Replace';
import format from './directives/Format';
import svgTimer from './directives/Timer';
import {fraction, fraction_string} from './filters/Fraction';
import formatnumber from './filters/FormatNumber';
import eval_string from './filters/EvalString';
import aside from './factories/Aside';
import AuctionUtils from './factories/Utils';
import AuctionConfig from './config';
import translations from './translations';

const appRequires = [
  'ui.bootstrap',
  'ngCookies',
  'pascalprecht.translate',
  'timer',
  'angular-growl',
  'angular-ellipses',
  'GTMLogger'
];

let app = angular.module('auction', appRequires),
    db = {},
    bidder_id = "0",
    auction_doc_id = auction_doc_id || "",
    db_url = (location.protocol + '//' + location.host + '/auctions/' ) || "",
    evtSrc = {},
    dataLayer = dataLayer || [];

app
  .constant('AuctionConfig', {
    auction_doc_id: auction_doc_id,
    remote_db: db_url,
    restart_retries: 10,
    default_lang: 'uk',
    debug: false })
  .config(['$logProvider', 'AuctionConfig', 'growlProvider', 'GTMLoggerProvider', AuctionConfig])
  .config(['$translateProvider', translations])
  .filter('formatnumber', ['$filter', formatnumber])
  .filter('fraction', ['$filter', fraction])
  .filter('fraction_string', ['$filter', fraction_string])
  .filter('eval_string', ['$filter', eval_string])
  .factory('aside', aside)
  .factory('AuctionUtils', ['$filter', '$timeout', '$log', '$window', AuctionUtils])
  .directive('nghReplace', nghReplace)
  .directive('format', format)
  .directive('svgtimer', svgTimer)
  .controller('OffCanvasController', ['$scope', '$modalInstance', OffCanvasController])
  .controller('AuctionController', [
    '$scope', 'AuctionConfig', 'AuctionUtils',
    '$timeout', '$http', '$log', '$cookies',
    '$cookieStore', '$window', '$rootScope',
    '$location', '$translate', '$filter',
    'growl', 'growlMessages', 'aside', '$q', AuctionController]);



function logMSG(MSG)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", '/log', true);
    xmlHttp.send(JSON.stringify(MSG));
}

