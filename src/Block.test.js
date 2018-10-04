import Block from './Block'


const blockInfo = {
    name: 'UserDetail',
    initialState: { loading: false, value: null },
    reducer: {
        start: (state, action) => ({
            ...state,
            loading: true,
        }),
        finish: (state, action) => ({
            ...state,
            loading: false,
            value: action.payload,
        }),
    },
    methods: {
        get: (params) => (dispatch, getState) => {
            dispatch('start')
            dispatch('finish', { name: 'Mike' })
        },
        asyncGet: (params) => (dispatch, getState) => {
            dispatch('start')
            return new Promise(resolve => {
                setTimeout(() => {
                    dispatch('finish', { name: 'Super Mike' })
                    resolve()
                })
            })
        },
    },
}

it('Block._checkBlockInfo', () => {
    expect(() => {
        Block._checkBlockInfo({})
    }).toThrow()
})

it('Block._addMethodsInBlock', () => {
    const block = new Block({ ...blockInfo })
    expect(block.get).toBeDefined()
    expect(block.asyncGet).toBeDefined()
})

it('Block._getMethod', () => {
    const block = new Block({ ...blockInfo })
    expect(block._getMethod('get')).toBeDefined()
    expect(block._getMethod('asyncGet')).toBeDefined()
})

it('Block._getPatchedDispatch', () => {
    const block = new Block({ ...blockInfo })
    let data
    const dispatch = (_data) => {
        data = _data
    }

    block._getPatchedDispatch(dispatch)('testType', 'testData')

    expect(data.type).toEqual('UserDetail.testType')
    expect(data.payload).toEqual('testData')
})

it('Block._getActionType', () => {
    const block = new Block({ ...blockInfo })
    expect(block._getActionType('test1')).toEqual('UserDetail.test1')
    expect(block._getActionType('#test2')).toEqual('test2')
})

it('Block._reducer', () => {
    const block = new Block({ ...blockInfo })
    const state = block._reducer({}, { type: 'UserDetail.start' })
    expect(state.loading).toBeTruthy()
})
