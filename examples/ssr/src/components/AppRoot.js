import React, { Component } from 'react'
import { renderRoutes } from 'react-router-config'
import '../index.css'


class AppRoot extends Component {
    render() {
        return renderRoutes(this.props.route.routes)
    }
}


export default AppRoot
