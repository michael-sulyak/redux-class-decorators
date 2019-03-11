# redux-class-decorators

[![NPM](https://img.shields.io/npm/v/redux-class-decorators.svg?style=flat-square)](https://www.npmjs.com/package/redux-class-decorators)  [![Scrutinizer Code Quality](https://img.shields.io/scrutinizer/g/expert-m/redux-class-decorators.svg?style=flat-square)](https://scrutinizer-ci.com/g/expert-m/redux-class-decorators/?branch=master)  [![Build Status](https://img.shields.io/scrutinizer/build/g/expert-m/redux-class-decorators.svg?style=flat-square)](https://scrutinizer-ci.com/g/expert-m/redux-class-decorators/build-status/master)  [![GitHub Issues](https://img.shields.io/github/issues/expert-m/redux-class-decorators.svg?style=flat-square)](https://github.com/expert-m/redux-class-decorators/issues)  [![Gitter](https://img.shields.io/badge/gitter-join_chat-blue.svg?style=flat-square)](https://gitter.im/expert_m/redux-class-decorators)  [![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

## Table Of Contents
- [Installation](#installation)
    - [npm](#npm)
    - [yarn](#yarn)
- [Overview](#overviewe)
- [How To Use](#how-to-use)
- [Bonus](#bonus)
- [License](#license)

## Installation

#### npm
```bash
npm install redux-class-decorators
```

#### yarn
```bash
yarn add redux-class-decorators
```

---

# Overview
Writing reducers can be annoying, it takes time to create actionTypes, and actions, and to put it all into a switch. The benefits of this package is that you don't have to manage a separate actionTypes file. You get to define actions and a reducer in classes and all your types and API calls will live on just some objects. Just a matter of preference.

You haven't to declare or manage string constants. This package meets the standard for stream action objects and will automatically declare string constants for types. Also this package works well with [redux-thunk](https://github.com/reduxjs/redux-thunk).

If you have any questions, you can see [examples of use](https://github.com/expert-m/redux-class-decorators/tree/master/examples).

[back to top](#table-of-contents)

---

# How To Use
Redux recommends creating constants, action creators and reducers separately. And we try to stick to this rule.

Reducer:
```js
import { ReducerClass } from 'redux-class-decorators'

@ReducerClass('Profile')
class ProfileReducer {
  static initialState = {
    value: null,
    loading: false,
  }

  static startLoading(state, action) {
    return {
      ...state,
      loading: true,
    }
  }

  static finishLoading(state, action) {
    return {
      ...state,
      value: action.payload,
      loading: false,
    }
  }

  static clear(state) {
    return {
      ...state,
      value: null,
      loading: false,
    }
  }
}
```

Actions:
```js
import { ActionClass } from 'redux-class-decorators'

@ActionClass
class ProfileActionSet {
  static get() {
    return (dispatch, getState) => {
      dispatch({
        type: ProfileReducer.startLoading,
      })

      const profile = { id: 1, name: 'Mike' }

      dispatch({
        type: ProfileReducer.finishLoading,
        payload: profile,
      })
    }
  }

  static clear() {
    return {
      type: ProfileActionSet.clear,
    }
  }
}
```

Usage:
```js
// Create store
const store = createStore(ProfileReducer.$reducer, null, applyMiddleware(thunk))

// Get dispatch
const dispatch = store.dispatch

dispatch(ProfileActionSet.get())
// Actions:
// { type: 'PROFILE__START_LOADING' }
// { type: 'PROFILE__FINISH_LOADING', payload: { id: 1, name: 'Mike' } }
// state == { value: { id: 1, name: 'Mike' }, loading: false }

dispatch(Something.clear()) // { type: 'PROFILE__CLEAR' }
// state == { value: null, loading: false }
```

Example of using `redux-class-decorators`:
* [Simple](https://github.com/expert-m/redux-class-decorators/tree/master/examples/simple) ([Demo](https://expert-m.github.io/redux-class-decorators/))

[back to top](#table-of-contents)

---

## Bonus
> `PlumbingActionClass` allows you to use one class to work with different instances.

Reducer:
```js
import { PlumbingReducerClass } from 'redux-class-decorators'

@PlumbingReducerClass('Banner')
class BannerReducer {
  static $getInitialState() {
    return {
      value: null,
    }
  }

  static setValue(state, action) {
    return {
      ...state,
      value: action.payload,
    }
  }
}
```

Actions:
```js
import { PlumbingActionClass } from 'redux-class-decorators'

@PlumbingActionClass
class Banner {
  static $getIndex(params) {
    return params.type
  }

  static add(newValue) {
     return {
       type: BannerReducer.setValue,
       payload: newValue,
     }
  }
}
```

Usage:
```js
// Create store
const store = createStore(BannerReducer.$reducer, null, applyMiddleware(thunk))

// Get dispatch
const dispatch = store.dispatch

dispatch(Banner.add({ type: 'left', text: 'Test1' }))
// { type: 'BANNER__SET_VALUE', payload: 5 }

dispatch(Banner.add({ type: 'right', text: 'Test2' }))
// { type: 'BANNER__SET_VALUE', payload: 10 }

// state == { 'left': { value: 'Test1' }, 'right': { value: 'Test2' } }
```

[back to top](#table-of-contents)

---

## License
MIT
