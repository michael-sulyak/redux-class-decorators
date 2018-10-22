import { PlumbingReducerClass, ReducerClass } from 'redux-class-decorators'


class BaseUserReducer {
  static initialState = {
    loading: false,
    value: null,
  }

  static $reducer

  static start(state, action) {
    return {
      ...state,
      value: action.payload,
    }
  }

  static finish(state, action) {
    return {
      ...state,
      loading: false,
      value: action.payload,
    }
  }
}


class UserListReducer extends BaseUserReducer {
}

ReducerClass('UserList')(UserListReducer)


class UserDetailReducer extends BaseUserReducer {
}

ReducerClass('UserDetail')(UserDetailReducer)


class SomethingReducer {
  static $reducer

  static $getInitialState() {
    return {
      loading: false,
      value: null,
    }
  }

  static start(state, action) {
    return {
      ...state,
      value: action.payload,
    }
  }

  static finish(state, action) {
    return {
      ...state,
      loading: false,
      value: action.payload,
    }
  }
}

PlumbingReducerClass('Something')(SomethingReducer)


export {
  UserListReducer,
  UserDetailReducer,
  SomethingReducer,
}
