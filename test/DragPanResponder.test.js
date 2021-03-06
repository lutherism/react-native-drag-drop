/* @flow weak */

'use strict';

import {expect} from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

import React from './__mocks__/react-native';
// Import the real DragContext class so that type checking works.
import { DragContext } from '../src/DragContext';
const { PanResponder } = React;

describe('createDragPanResponder', () => {
  let createDragPanResponder;
  let dragContext;

  let panDirection;
  let dragItem;
  let onStop;
  let state;

  beforeEach(() => {
    dragItem = {
      id: '123',
    };

    panDirection = 'y';

    state = {
      dragItem,
      pan: new React.Animated.ValueXY()
    };

    ({createDragPanResponder} = proxyquire('../src/DragPanResponder', {
      'react-native': React,
      './DragContext': {
        DragContext,
        '@noCallThru': true,
      },
    }));

    dragContext = {
      getBaseLayout: sinon.stub(),
    };

    dragContext.getBaseLayout.returns({
      x: 0, y: 0, width: 100, height: 200
    });

    onStop = sinon.stub();
  });

  function subject() {
    return createDragPanResponder(
      state,
      dragContext,
      panDirection,
      onStop
    );
  }

  it('sets up the pan responder for dragging', () => {
    sinon.spy(PanResponder, 'create');
    subject();
    expect(PanResponder.create).to.have.been.called;
    PanResponder.create.restore();
  });

  describe('handlers', () => {
    let handlers;

    describe('onStartShouldSetPanResponder/onMoveShouldSetPanResponder', () => {
      beforeEach(() => {
        const responder = subject();
        handlers = responder.handlers;
      });

      it('responds on start/move', () => {
        expect(handlers.onStartShouldSetPanResponder()).to.be.true;
        expect(handlers.onMoveShouldSetPanResponder()).to.be.true;
      });
    });

    describe('onPanResponderMove', () => {
      let eventTracker;
      let e;
      let gestureState;

      function setup() {
        e = 'fake synthetic event';
        eventTracker = sinon.stub();
        sinon.stub(React.Animated, 'event').returns(eventTracker);
        handlers = subject().handlers;
      }

      afterEach(() => {
        React.Animated.event.restore();
      });

      function itAllowsTracking() {
        handlers.onPanResponderMove(e, gestureState);
        expect(eventTracker).to.have.been.calledWith(
          e, gestureState
        );
      }

      function itStopsTracking() {
        handlers.onPanResponderMove(e, gestureState);
        expect(eventTracker).not.to.have.been.called;
      }

      describe('x axis tracking', () => {
        beforeEach(() => {
          panDirection = 'x';
          setup();
        });

        it('tracks x axis movement via the pan state', () => {
          gestureState = {
            moveX: 100
          };
          handlers.onPanResponderMove(e, gestureState);
          expect(React.Animated.event).to.have.been.calledWithExactly(
            [
              null,
              {dx: state.pan.x},
            ]
          );
          expect(eventTracker).to.have.been.calledWith(
            e, gestureState
          );
        });

        describe('bounding', () => {
          describe('beyond left bound', () => {
            it('stops tracking the pan', () => {
              gestureState = {
                moveX: -5
              };

              itStopsTracking();
            });

            describe('when moving to the right', () => {
              it('allows tracking', () => {
                gestureState = {
                  moveX: -5,
                  vx: 3
                };

                itAllowsTracking();
              });
            });
          });

          describe('beyond right bound', () => {
            it('stops tracking the pan', () => {
              gestureState = {
                moveX: 105
              };
              itStopsTracking();
            });

            describe('when moving to the left', () => {
              it('allows tracking', () => {
                gestureState = {
                  moveX: 105,
                  vx: -3
                };
                itAllowsTracking();
              });
            });
          });
        });
      });

      describe('y axis tracking', () => {
        beforeEach(() => {
          panDirection = 'y';
          setup();
        });

        it('tracks y axis movement via the pan state', () => {
          gestureState = {
            moveY: 100
          };
          itAllowsTracking();
          expect(React.Animated.event).to.have.been.calledWithExactly(
            [
              null,
              {dy: state.pan.y},
            ]
          );
        });

        describe('bounding', () => {
          describe('beyond upper bounds', () => {
            it('stops tracking the pan', () => {
              gestureState = {
                moveY: -5,
              };
              itStopsTracking();
            });

            describe('when the gesture is moving downwards', () => {
              it('allows tracking', () => {
                gestureState = {
                  moveY: -5,
                  vy: 3
                };
                itAllowsTracking();
              });
            });
          });
        });
        describe('beyond lower bounds', () => {
          it('stops tracking', () => {
            gestureState = {
              moveY: 205
            };
            itStopsTracking();
          });

          describe('moving upwards', () => {
            it('allows tracking', () => {
              gestureState = {
                moveY: 205,
                vy: -1
              };
              itAllowsTracking();
            });
          });
        });
      });
    });
  });
});