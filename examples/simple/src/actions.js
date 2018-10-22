import { ActionClass, PlumbingActionClass } from 'redux-class-decorators'
import {
  SomethingReducer, UserDetailReducer,
  UserListReducer,
} from './reducers'


class UserList {
  static get() {
    return (dispatch) => {
      dispatch({ type: UserListReducer.start })

      return fetch('https://reqres.in/api/users').then(
        response => response.json(),
      ).then((json) => dispatch({
        type: UserListReducer.finish,
        payload: json.data,
      }))
    }
  }
}

ActionClass(UserList)


class UserDetail {
  static get(userId) {
    return (dispatch) => {
      dispatch({ type: UserDetailReducer.start })

      return fetch(`https://reqres.in/api/users/${userId}`).then(
        response => response.json(),
      ).then((json) => dispatch({
        type: UserDetailReducer.finish,
        payload: json.data,
      }))
    }
  }
}

ActionClass(UserDetail)


class Something {
  static $getIndex(id) {
    return id
  }

  static get(id) {
    return (dispatch) => {
      dispatch({ type: SomethingReducer.start })

      return fetch(`https://reqres.in/api/unknown/${id}`).then(
        response => response.json(),
      ).then((json) => dispatch({
        type: SomethingReducer.finish,
        payload: json.data,
      }))
    }
  }
}

PlumbingActionClass(Something)

export {
  UserList,
  UserDetail,
  Something,
}
