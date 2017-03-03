'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = wrapRootEpic;

require('rxjs');

var _EmptyObservable = require('rxjs/observable/EmptyObservable');

var _Subject = require('rxjs/Subject');

var _Subscriber = require('rxjs/Subscriber');

var _EPIC_END = require('redux-observable/lib/EPIC_END');

var endAction = { type: _EPIC_END.EPIC_END };

function wrapRootEpic(rootEpic) {
  var actionsProxy = _EmptyObservable.EmptyObservable.create();
  var lifecycle = _EmptyObservable.EmptyObservable.create();
  var subscription = void 0;
  var start = void 0;
  function wrappedEpic(actions) {
    for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    var results = new _Subject.Subject();
    start = function start() {
      subscription = new _Subscriber.Subscriber();
      actionsProxy = new _Subject.Subject();
      // how can subject inherit from ActionsObservable
      actionsProxy.ofType = actions.ofType;
      lifecycle = new _Subject.Subject();
      var actionsSubscription = actions.subscribe(actionsProxy);
      var epicsSubscription = rootEpic.apply(undefined, [actionsProxy].concat(rest)).subscribe(function (action) {
        return results.next(action);
      }, function (err) {
        return lifecycle.error(err);
      }, function () {
        return lifecycle.complete();
      });

      subscription.add(epicsSubscription);
      subscription.add(actionsSubscription);
    };
    start();
    return results;
  }

  wrappedEpic.subscribe = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return lifecycle.subscribe.apply(lifecycle, args);
  };
  wrappedEpic.unsubscribe = function () {
    return subscription.unsubscribe();
  };
  wrappedEpic.end = function () {
    actionsProxy.next(endAction);
    actionsProxy.complete();
  };
  wrappedEpic.restart = function () {
    wrappedEpic.unsubscribe();
    actionsProxy.unsubscribe();
    start();
  };

  return wrappedEpic;
}