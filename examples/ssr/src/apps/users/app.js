import { base } from 'react-rambo'


export default class UsersApp extends base.BaseApp {
    name = 'users'

    mount(data) {
        describeApp(this, this.core.req)
        return true
    }
}

function describeApp(app, req) {
    app.addValues({
        title: 'User List ;)',
    })

    app.addBlock('list', {
        initialState: {
            loading: false,
            value: null,
        },
        reducer: {
            'start': (state, action) => ({
                ...state,
                loading: true,
            }),
            'finish': (state, action) => ({
                ...state,
                loading: false,
                value: action.payload,
            }),
        },
        methods: {
            'get': (params) => (dispatch, getState) => {
                dispatch('start')

                return req.get('/users', params).then((data) => {
                    dispatch('finish', data.json.data)
                })
            },
        },
    })
}
