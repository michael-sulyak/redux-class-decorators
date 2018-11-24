import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Something, UserDetail, UserList } from './actions'


class App extends Component {
  componentDidMount() {
    this.props.getUserList()

    this.props.getUserDetail(1)

    this.props.getSomething(2)
    this.props.getSomething(5)
  }

  render() {
    const {
      userList,
      userDetail,
      something,
    } = this.props

    return (
      <div className="App">
        <div className="block">
          <h1>UserList</h1>

          {userList.loading && <div>Loading...</div>}
          {!!userList.value && userList.value.map((user, i) => (
            <div key={user.id}>
              {i + 1}. {user.first_name} {user.last_name}
            </div>
          ))}
        </div>

        <div className="block">

          <h1 className="App-title">UserDetail</h1>
          {userDetail.loading && <div>Loading...</div>}
          {!!userDetail.value && (
            <div>
              ID: {userDetail.value.id}<br />
              First name: {userDetail.value.first_name}<br />
              Last name: {userDetail.value.last_name}
            </div>
          )}
        </div>


        <div className="block">
          <h1 className="App-title">Something</h1>
          {something ? (
            <div>
              {something[2] && something[2].loading && <div>Loading...</div>}
              {something[2] && something[2].value &&
              <div>{something[2].value.name}</div>}
              {something[5] && something[5].loading && <div>Loading...</div>}
              {something[5] && something[5].value &&
              <div>{something[5].value.name}</div>}
            </div>
          ) : ''}
        </div>

        <a
          href="https://github.com/expert-m/redux-class-decorators/tree/master/examples/simple"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >GitHub</a>
      </div>
    )
  }
}

App.propTypes = {
  userList: PropTypes.object,
  userDetail: PropTypes.object,
  something: PropTypes.object,
  getUserList: PropTypes.func,
  getUserDetail: PropTypes.func,
  getSomething: PropTypes.func,
}

const mapStateToProps = (state) => ({
  userList: state.users.list,
  userDetail: state.users.detail,
  something: state.something,
})

const mapDispatchToProps = (dispatch) => ({
  getUserList: bindActionCreators(UserList.get, dispatch),
  getUserDetail: bindActionCreators(UserDetail.get, dispatch),
  getSomething: bindActionCreators(Something.get, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
