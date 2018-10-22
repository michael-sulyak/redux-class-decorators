import ReducerClass from '../ReducerClass'
import ActionClass from '../ActionClass'
import thunk from 'redux-thunk'
import { applyMiddleware, createStore } from 'redux'


it('test dispatch', () => {
  class BaseReducer {
    static initialState = { value: 0 }

    static clear(state) {
      return {
        ...state,
        value: BaseReducer.initialState.value,
      }
    }
  }

  class SomeReducer extends BaseReducer {
    static setValue(state, action) {
      return {
        ...state,
        value: action.payload,
      }
    }
  }

  ReducerClass('Some')(SomeReducer)

  class BaseAction {
    static set(newValue) {
      return (dispatch, getState) => {
        dispatch({
          type: SomeReducer.setValue,
          payload: newValue,
        })
      }
    }
  }

  class Something extends BaseAction {
    static clear() {
      return {
        type: SomeReducer.clear,
      }
    }
  }

  ActionClass(Something)

  const store = createStore(SomeReducer.$reducer, undefined, applyMiddleware(thunk))
  const dispatch = store.dispatch

  expect(store.getState()).toEqual(SomeReducer.initialState)

  dispatch(Something.set(5))
  expect(store.getState()).toEqual({ value: 5 })

  dispatch(Something.clear())
  expect(store.getState()).toEqual({ value: 0 })
})
