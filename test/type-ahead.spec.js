var assert = require('chai').assert;
var typeAhead = require('../src/index.js');

describe('component: typeAhead', function() {
  var $rootScope;
  var $scope;
  var $componentController;

  beforeEach(angular.mock.module(typeAhead));

  beforeEach(inject(function(_$rootScope_, _$componentController_) {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $componentController = _$componentController_;
  }));

  it('should set the default values and methods', function() {
    var component = $componentController('typeAhead', {$scope: $scope});
    assert.isNumber(component.currPos);
    assert.isNumber(component.threshold);
    assert.isNumber(component.limit);
    assert.isNumber(component.delay);
    assert.isArray(component.suggestions);
    assert.equal(component.showSuggestions, false);
    assert.isFunction(component.onSelect);
    assert.isFunction(component.onInput);
    assert.isFunction(component.onKeyUp);
    assert.isFunction(component.onBlur);
  });

  it('should set user given values', function() {
    var bindings = {
      source: ['France', 'Japan', 'Canada'],
      threshold: 5,
      limit: 99,
      delay: 200,
      search: function(){},
      callback: function(){},
      display: 'some_prop_name'
    };
    var component = $componentController('typeAhead', {$scope: $scope}, bindings);
    assert.equal(component.source, bindings.source);
    assert.equal(component.threshold, bindings.threshold);
    assert.equal(component.limit, bindings.limit);
    assert.equal(component.delay, bindings.delay);
    assert.equal(component.search, bindings.search);
    assert.equal(component.callback, bindings.callback);
    assert.equal(component.display, bindings.display);
  });

  it('should handle input', function() {
    var bindings = {
      search: search 
    };
    var component = $componentController('typeAhead', {$scope: $scope}, bindings);
    
    component.input = 'some';
    component.onInput();
    
    function search(str) {
      assert.equal(str, component.input);
      return ['some pie', 'some text', 'some more'];
    }
  });

  it('should handle up arrow key', function() {
    var bindings = {
    };
    var component = $componentController('typeAhead', {$scope: $scope}, bindings);
    
    component.currPos = 1;
    component.input = 'some';
    component.onKeyUp({keyCode: 38});

    assert.equal(component.currPos, 0);
  });

  it('should handle down arrow key', function() {
    var bindings = {
      source: [1,2,3,4]
    };
    var component = $componentController('typeAhead', {$scope: $scope}, bindings);
    
    component.currPos = 0;
    component.input = 'some';
    component.onKeyUp({keyCode: 40});

    assert.equal(component.currPos, 1);
  });

  it('should handle enter key', function() {
    var bindings = {
      source: ['one', 'two', 'three', 'four']
    };
    var component = $componentController('typeAhead', {$scope: $scope}, bindings);
    
    component.currPos = 2;
    component.input = 'thr';
    component.onKeyUp({keyCode: 13});

    assert.equal(component.input, bindings.source[2]);
  });

  it('should call callback on selection', function() {
    var bindings = {
      source: ['one', 'two', 'three', 'four'],
      callback: callback
    };
    var component = $componentController('typeAhead', {$scope: $scope}, bindings);
    
    component.currPos = 2;
    component.input = 'thr';
    component.onKeyUp({keyCode: 13});

    function callback(item) {
      assert.equal(item, bindings.source[2]);
    }
  });

});
