import ReducerClass from '../ReducerClass'


it('test action type', () => {
  class BaseReducer {
    static test(state) {
      return state
    }
  }

  class Reducer extends BaseReducer{
    static _test(state) {
      return state
    }
  }

  ReducerClass('test')(Reducer)

  expect(Reducer.test.actionType).toEqual('TEST__TEST')
  expect(Reducer._test.actionType).toBeUndefined()
})
