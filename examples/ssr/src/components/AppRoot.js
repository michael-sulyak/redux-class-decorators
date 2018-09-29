import { Component } from 'react'
import { renderRoutes } from 'react-router-config'
import PropTypes from 'prop-types'
import '../index.css'


class AppRoot extends Component {
    render() {
        return renderRoutes(this.props.route.routes)
    }
}

AppRoot.propTypes = {
    route: PropTypes.object,
}

export default AppRoot
