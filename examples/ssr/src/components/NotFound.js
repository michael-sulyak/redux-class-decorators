import React from 'react'
import PropTypes from 'prop-types'


export default class NotFound extends React.Component {
    componentWillMount() {
        const { staticContext } = this.props

        if (staticContext) {
            staticContext.status = 404
        }
    }

    render() {
        return <div>404</div>
    }
}

NotFound.propTypes = {
    staticContext: PropTypes.object,
}
