'use strict';

import React, {Component} from 'react';
const ReactNative = React;

ReactNative.StyleSheet = {
    create: function(styles) {
        return styles;
    }
};

class ActivityIndicatorIOS extends Component {}
class ScrollView extends Component {}
class View extends Component {}
class Text extends Component {}
class TextInput extends Component {}
class TouchableHighlight extends Component {}
class PickerIOS extends Component {}
class PickerItem extends Component {}

class PanResponder {
  constructor(handlers) {
    this.handlers = handlers;
  }

  static create(handlers) {
    return new PanResponder(handlers);
  }
}

class Dimensions {
  static get() {
    return {
      height: 123,
      widght: 123
    }
  }
}

class StartableAnimation {
  start() {}
}

class Animated {
  static event() {}
  static parallel() { return new StartableAnimation(); }
  static spring() { return new StartableAnimation(); }
}

class AnimatedView extends Component {}
class AnimatedValue {
  setOffset() {}
}
class AnimatedValueXY {
  constructor() {
    this.x = {
      _value: null,
      _offset: null
    };
    this.y = {
      _value: null,
      _offset: null
    };
  }

  addListener() {}
  getLayout() {}
  removeListener() {}
  setOffset({x, y}) {
    this.x._offset = x;
    this.y._offset = y;
  }
  setValue() {}
}

class InteractionManager {
  static runAfterInteractions() {}
}

Animated.View = AnimatedView;
Animated.Value = AnimatedValue;
Animated.ValueXY = AnimatedValueXY;

PickerIOS.Item = PickerItem;

ReactNative.ActivityIndicatorIOS = ActivityIndicatorIOS;
ReactNative.Animated = Animated;
ReactNative.Dimensions = Dimensions;
ReactNative.InteractionManager = InteractionManager;
ReactNative.View = View;
ReactNative.ScrollView = ScrollView;
ReactNative.Text = Text;
ReactNative.TextInput = TextInput;
ReactNative.TouchableHighlight = TouchableHighlight;
ReactNative.PickerIOS = PickerIOS;

ReactNative.PanResponder = PanResponder;

ReactNative['@noCallThru'] = true;
ReactNative['@global'] = true;


module.exports = ReactNative;
