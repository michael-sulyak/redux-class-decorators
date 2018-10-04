import React from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './App'
import { SomethingBlock, UserDetailBlock, UserListBlock } from './blocks'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import './index.css'


const rootReducer = combineReducers({
    users: combineReducers({
        list: UserListBlock._reducer,
        detail: UserDetailBlock._reducer,
    }),
    something: SomethingBlock._reducer,
})
const logger = createLogger()
const store = createStore(rootReducer, {}, applyMiddleware(thunk, logger))

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'),
)
