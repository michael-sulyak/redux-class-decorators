import Core from '../Core'
import Store from './Store'


it('createStore', () => {
    const core = new Core({
        modules: [Store],
    })

    core.store.initialState.test = true
    const store = core.store.createStore()
    const state = store.getState()

    expect(state.test).toBeTruthy()
})

it('reducer', () => {
    const core = new Core({
        modules: [Store],
    })

    core.store.addReducer((state, action) => ({
        ...state,
        test: true,
    }))

    let state = {}
    state = core.store.reducer(state, {})

    expect(state.test).toBeTruthy()
})
