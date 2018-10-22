import PlumbingReducerClass from '../PlumbingReducerClass'


it('test action type', () => {
  class Reducer {
    static test(state) {
      return state
    }

    static _test(state) {
      return state
    }
  }

  PlumbingReducerClass('test')(Reducer)

  expect(Reducer.test.actionType).toEqual('TEST__TEST')
  expect(Reducer._test.actionType).toBeUndefined()
})
