import React from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './App'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import './index.css'
import {
  SomethingReducer, UserDetailReducer,
  UserListReducer,
} from './reducers'


const rootReducer = combineReducers({
  users: combineReducers({
    list: UserListReducer.$reducer,
    detail: UserDetailReducer.$reducer,
  }),
  something: SomethingReducer.$reducer,
})
const logger = createLogger()
const store = createStore(rootReducer, {}, applyMiddleware(thunk, logger))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
)
