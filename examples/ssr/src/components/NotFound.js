import React from 'react'


export default class NotFound extends React.Component {
    componentWillMount() {
        const {staticContext} = this.props

        if (staticContext) {
            staticContext.status = 404
        }
    }

    render() {
        return <div>404</div>
    }
}
