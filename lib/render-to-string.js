'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderToString;

var _Observable = require('rxjs/Observable');

var _last = require('rxjs/operator/last');

var _map = require('rxjs/operator/map');

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('react-redux-epic:render-to-string');

// renderToString(
//   Component: ReactComponent,
//   epicMiddleware: EpicMiddleware
// ) => Observable[String]

function renderToString(Component, wrappedEpic) {
  var _context;

  try {
    log('initial render pass started');
    _server2.default.renderToStaticMarkup(Component);
    log('initial render pass completed');
  } catch (e) {
    return _Observable.Observable.throw(e);
  }
  log('calling action$ onCompleted');
  wrappedEpic.end();
  return (_context = (_context = _Observable.Observable.create(wrappedEpic.subscribe), _last.last).call(_context, null, null, null), _map.map).call(_context, function () {
    wrappedEpic.restart();
    var markup = _server2.default.renderToString(Component);
    return { markup: markup };
  });
}