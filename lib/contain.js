'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = contain;

var _react = require('react');

var _isFunction = require('rxjs/util/isFunction');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// // Using rtype signatures
// interface Action {
//   type: String,
//   payload?: Any,
//   ...meta?: Object
// }
//
// ActionCreator(...args?) => Action
//
// interface Options {
//   fetchAction?: ActionCreator,
//   getActionArgs?(props: Object, context: Object) => [],
//   isPrimed?(props: Object, context: Object) => Boolean,
//   shouldRefetch?(
//     props: Object,
//     nextProps: Object,
//     context: Object,
//     nextContext: Object
//   ) => Boolean,
// }
//
// interface contain {
//   (options?: Options, Component: ReactComponent) => ReactComponent
//   (options?: Object) => (Component: ReactComponent) => ReactComponent
// }


var log = (0, _debug2.default)('redux-epic:contain');

function contain() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return function (Component) {
    var name = Component.displayName || 'Anon Component';
    var action = void 0;
    var isActionable = false;
    var hasRefetcher = (0, _isFunction.isFunction)(options.shouldRefetch);
    var getActionArgs = (0, _isFunction.isFunction)(options.getActionArgs) ? options.getActionArgs : function () {
      return [];
    };

    var isPrimed = (0, _isFunction.isFunction)(options.isPrimed) ? options.isPrimed : function () {
      return false;
    };

    function runAction(props, context, action) {
      var actionArgs = getActionArgs(props, context);
      !Array.isArray(actionArgs) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '\n          ' + name + ' getActionArgs should always return an array\n          but got ' + actionArgs + '. check the render method of ' + name + '\n        ') : (0, _invariant2.default)(false) : void 0;
      return action.apply(null, actionArgs);
    }

    var Container = function (_PureComponent) {
      _inherits(Container, _PureComponent);

      function Container() {
        _classCallCheck(this, Container);

        return _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).apply(this, arguments));
      }

      _createClass(Container, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          var props = this.props,
              context = this.context;

          var fetchAction = options.fetchAction;
          if (!options.fetchAction) {
            log('Container(' + name + ') has no fetch action defined');
            return;
          }
          if (isPrimed(this.props, this.context)) {
            log('contain(' + name + ') is primed');
            return;
          }

          action = props[options.fetchAction];
          isActionable = typeof action === 'function';

          !isActionable ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '\n            ' + fetchAction + ' should be a function on Container(' + name + ')\'s props\n            but found ' + action + '. Check the fetch options for ' + name + '.\n          ') : (0, _invariant2.default)(false) : void 0;

          runAction(props, context, action);
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps, nextContext) {
          if (!isActionable || !hasRefetcher || !options.shouldRefetch(this.props, nextProps, this.context, nextContext)) {
            return;
          }

          runAction(nextProps, nextContext, action);
        }
      }, {
        key: 'render',
        value: function render() {
          return (0, _react.createElement)(Component, this.props);
        }
      }]);

      return Container;
    }(_react.PureComponent);

    Container.displayName = 'Container(' + name + ')';
    return Container;
  };
}