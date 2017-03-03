'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = render;

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Observable = require('rxjs/Observable');

var _Subscription = require('rxjs/Subscription');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// render(
//   Component: ReactComponent,
//   DomContainer: DOMNode
// ) => Observable[RootInstance]

function render(Component, DOMContainer) {
  return _Observable.Observable.create(function (observer) {
    try {
      _reactDom2.default.render(Component, DOMContainer, function () {
        observer.next(this);
      });
    } catch (e) {
      return observer.error(e);
    }

    return new _Subscription.Subscription(function () {
      return _reactDom2.default.unmountComponentAtNode(DOMContainer);
    });
  });
}