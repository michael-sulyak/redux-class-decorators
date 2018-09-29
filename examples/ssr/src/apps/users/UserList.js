import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Core } from 'react-apps'
import PropTypes from 'prop-types'
import coreConfig from '../../coreConfig'


const core = Core.getInstance(coreConfig)


class UserList extends Component {
    static componentWillRenderOnServer(core, props) {
        return Promise.all([
            core.apps.users.list.get({ 'page': 3 })(props.store.dispatch, props.store.getState),
        ])
    }

    componentDidMount() {
        if (!this.props.userList.value) {
            this.props.getUserList({ 'page': 3 })
        }
    }

    render() {
        const {
            title,
            userList,
        } = this.props

        return (
            <div className="App">
                <h1 className="App-title">{title}</h1>

                {userList.loading && <div>Loading...</div>}
                {!!userList.value && userList.value.map((user, i) => (
                    <div key={user.id}>
                        {i + 1}. {user.first_name} {user.last_name}
                    </div>
                ))}
                <br />
                <a
                    href="https://github.com/expert-m/react-apps/tree/master/examples/ssr"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub
                </a>
            </div>
        )
    }
}

UserList.propTypes = {
    title: PropTypes.string,
    userList: PropTypes.object,
    getUserList: PropTypes.func,
}

const mapStateToProps = (state) => ({
    title: state.users.title,
    userList: state.users.list,
})

const mapDispatchToProps = (dispatch) => ({
    getUserList: bindActionCreators(core.apps.users.list.get, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserList)
