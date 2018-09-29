import React from 'react'
import ReactDOM from 'react-dom'
import coreConfig from './coreConfig'
import { Core } from 'react-rambo'
import { Provider } from 'react-redux'
import UserList from './apps/users/UserList'
import './index.css'


const core = Core.getInstance(coreConfig)
const store = core.store.createStore()


ReactDOM.render(
    <Provider store={store}>
        <UserList />
    </Provider>,
    document.getElementById('root'),
)
