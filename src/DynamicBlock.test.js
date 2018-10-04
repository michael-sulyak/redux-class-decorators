import DynamicBlock from './DynamicBlock'


const blockInfo = {
    name: 'BannerList',
    index: 'type',
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
            dispatch('finish', { name: 'Test', type: params.type })
        },
    },
}

it('DynamicBlock._getMethod', () => {
    const block = new DynamicBlock({ ...blockInfo })
    expect(block._getMethod('get')).toBeDefined()
})

it('DynamicBlock._getPatchedDispatch', () => {
    const block = new DynamicBlock({ ...blockInfo })
    let data
    const dispatch = (_data) => {
        data = _data
    }

    block._getPatchedDispatch(dispatch, { 'type': 'right' })('testType')
    expect(data.type).toEqual('BannerList.testType[right]')
})

it('DynamicBlock._reducer', () => {
    const block = new DynamicBlock({ ...blockInfo })
    const state = block._reducer({}, { type: 'BannerList.start[right]' })
    expect(state.right.loading).toBeTruthy()
})
