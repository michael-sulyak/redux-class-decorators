import React from 'react'
import ReactDOM from 'react-dom'
import coreConfig from './coreConfig'
import { Core } from 'react-apps'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import './index.css'
import routes from './routes'


const core = Core.getInstance(coreConfig)
const store = core.store.createStore()


ReactDOM.hydrate(
    <Provider store={store}>
        <BrowserRouter>
            {renderRoutes(routes)}
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'),
)
