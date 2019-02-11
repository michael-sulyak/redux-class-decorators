import thunk from 'redux-thunk'
import { applyMiddleware, createStore } from 'redux'
import PlumbingReducerClass from '../PlumbingReducerClass'
import PlumbingActionClass from '../PlumbingActionClass'


it('test dispatch', () => {
  class BannerReducer {
    static $getInitialState() {
      return {
        value: null,
      }
    }

    static setValue(state, action) {
      return {
        ...state,
        value: action.payload,
      }
    }

    static clear() {
      return undefined
    }
  }

  PlumbingReducerClass('Banner')(BannerReducer)

  class BannerActionSet {
    static $getIndex() {
      return arguments[0]
    }

    static set(type, newValue) {
      return (dispatch, getState) => {
        dispatch({
          type: BannerReducer.setValue,
          payload: newValue,
          meta: {},
        })
      }
    }

    static clear() {
      return {
        type: BannerReducer.clear,
      }
    }
  }

  PlumbingActionClass(BannerActionSet)

  const store = createStore(BannerReducer.$reducer, undefined, applyMiddleware(thunk))
  const dispatch = store.dispatch

  expect(store.getState()).toEqual({})

  dispatch(BannerActionSet.set('left', 'BANNER 1'))
  expect(store.getState()).toEqual({ left: { value: 'BANNER 1' } })

  dispatch(BannerActionSet.set('right', 'BANNER 2'))
  expect(store.getState()).toEqual({
    left: { value: 'BANNER 1' },
    right: { value: 'BANNER 2' },
  })

  dispatch(BannerActionSet.clear('left'))
  expect(store.getState()).toEqual({ right: { value: 'BANNER 2' } })
})

it('test arguments', () => {
  const myTestFunc = (value) => {
    return `${value} - test`
  }

  class BannerReducer {
    static $getInitialState() {
      return {
        value: null,
      }
    }

    static setValue(state, action) {
      return {
        ...state,
        value: action.payload,
      }
    }
  }

  PlumbingReducerClass('Banner')(BannerReducer)

  class BannerActionSet {
    static $getIndex() {
      return arguments[0]
    }

    static set(type, newValue) {
      return (dispatch, getState, testFunc) => {
        dispatch({
          type: BannerReducer.setValue,
          payload: testFunc(newValue),
        })
      }
    }
  }

  PlumbingActionClass(BannerActionSet)

  const store = createStore(BannerReducer.$reducer, undefined, applyMiddleware(thunk.withExtraArgument(myTestFunc)))
  const dispatch = store.dispatch

  expect(store.getState()).toEqual({})

  dispatch(BannerActionSet.set('left', 'BANNER 1'))
  expect(store.getState()).toEqual({ left: { value: 'BANNER 1 - test' } })
})
