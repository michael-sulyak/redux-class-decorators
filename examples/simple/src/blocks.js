import { block, dynamicBlock } from 'react-rambo'

/* global fetch */


export const UserListBlock = block({
    name: 'UserList',
    initialState: {
        loading: false,
        value: null,
    },
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

            return fetch('https://reqres.in/api/users').then(
                response => response.json()
            ).then(
                json => dispatch('finish', json.data)
            )
        },
    },
})

export const UserDetailBlock = block({
    name: 'UserDetail',
    initialState: {
        loading: false,
        value: null,
    },
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

            return fetch(`https://reqres.in/api/users/${params.id}`).then(
                response => response.json()
            ).then(
                json => dispatch('finish', json.data)
            )
        },
    },
})

export const SomethingBlock = dynamicBlock({
    name: 'UserDetail',
    index: params => `${params.id}`,
    initialState: {
        loading: false,
        value: null,
    },
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

            return fetch(`https://reqres.in/api/unknown/${params.id}`).then(
                response => response.json()
            ).then(
                json => dispatch('finish', json.data)
            )
        },
    },
})
