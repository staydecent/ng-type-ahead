(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['angular'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('angular'));
  } else {
    return factory(root.angular);
  }
}(this, function (angular) {
  'use strict';
   
  var moduleName = 'typeAheadModule';

  angular
    .module(moduleName, [])
    .component('typeAhead', {
      templateUrl: 'template.html',
      controller: TypeAheadController,
      controllerAs: 'scope',
      bindings: {
        placeholder: '@',
        source: '<',
        search: '<',
        threshold: '<?',
        limit: '<?',
        delay: '<?',
        display: '<?',
        callback: '<?'
      }  
    });

  function TypeAheadController($q) {
    var KEY = {
      UP: 38,
      DOWN: 40,
      ENTER: 13,
      TAB: 9,
      ESC: 27
    };

    var DEFAULT_POS = 0;

    var scope = this;

    // Setup defaults
    // ---

    scope.currPos = DEFAULT_POS;
    scope.suggestions = scope.source || [];
    scope.showSuggestions = false;

    if (scope.threshold === undefined) {
      scope.threshold = 2;
    }

    if (scope.limit === undefined) {
      scope.limit = Infinity;
    }

    if (scope.delay === undefined) {
      scope.delay = 100;
    }

    // Custom events
    // ---

    scope.onSelect = function onSelect(item) {
      scope.showSuggestions = false;
      scope.currPos = DEFAULT_POS;

      if (scope.callback) {
        scope.callback(item);
        scope.input = '';
      } else {
        if (scope.display) {
          scope.input = item[scope.display];
        } else {
          scope.input = item;
        }
      }
    };

    // DOM events
    // ---

    scope.onInput = function onInput() {
      if (scope.input.length < scope.threshold) {
        return;
      }

      return $q.when(scope.search(scope.input))
      .then(function(results) {
        scope.currPos = DEFAULT_POS;
        scope.suggestions = results;
        scope.showSuggestions = scope.suggestions.length && 
          scope.input && 
          scope.input.length >= scope.threshold;
      });
    };

    scope.onKeyUp = function onKeyUp(evt) {
      var max = scope.suggestions.length - 1;
      if (!scope.input || scope.input.length < scope.threshold) {
        return;
      }

      switch (evt.keyCode) {
        case KEY.UP:
          if (scope.currPos > 0) {
            scope.currPos--;
          }
          break;
        case KEY.DOWN:
          if (scope.currPos < max || scope.currPos === DEFAULT_POS) {
            scope.currPos++;
          }
          break;
        case KEY.ENTER:
          var val = scope.suggestions[scope.currPos] || scope.input;
          scope.onSelect(val);
          break;
        case KEY.ESC:
          scope.showSuggestions = false;
      }
    };

    scope.onBlur = function onBlur() {
      scope.showSuggestions = false;
    };
  }

  return moduleName;
}));
