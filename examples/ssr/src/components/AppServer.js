import React, { Component } from 'react'
import { renderRoutes } from 'react-router-config'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import routes from '../routes'


export default class AppServer extends Component {
    render() {
        const { store, context, location } = this.props

        return (
            <Provider store={store}>
                <StaticRouter context={context} location={location}>
                    {renderRoutes(routes)}
                </StaticRouter>
            </Provider>
        )
    }
}

AppServer.propTypes = {
    store: PropTypes.object,
    context: PropTypes.object,
    location: PropTypes.string,
}
