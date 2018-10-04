<p align="center">
    <img src="https://raw.githubusercontent.com/expert-m/react-rambo/master/logo.png" alt="react-rambo" />
</p>

<h1 align="center">react-rambo</h1>

<h4 align="center">New way of simple application development with React and Redux!</h4>

<p align="center">
    <a href="https://www.npmjs.com/package/react-rambo"><img src="https://img.shields.io/npm/v/react-rambo.svg?style=flat-square" alt="NPM"></a>  <a href="https://scrutinizer-ci.com/g/expert-m/react-rambo/?branch=master"><img src="https://img.shields.io/scrutinizer/g/expert-m/react-rambo.svg?style=flat-square" alt="Scrutinizer Code Quality"></a>  <a href="https://scrutinizer-ci.com/g/expert-m/react-rambo/build-status/master"><img src="https://img.shields.io/scrutinizer/build/g/expert-m/react-rambo.svg?style=flat-square" alt="Build Status"></a>  <a href="https://github.com/expert-m/react-rambo/issues"><img src="https://img.shields.io/github/issues/expert-m/react-rambo.svg?style=flat-square" alt="GitHub Issues"></a>  <a href="https://gitter.im/expert_m/react-rambo"><img src="https://img.shields.io/badge/gitter-join_chat-blue.svg?style=flat-square" alt="Gitter"></a>  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License"></a>
</p>

<br>

## Table Of Contents
- [Installation](#installation)
    - [npm](#npm)
    - [yarn](#yarn)
- [Blocks](#blocks)
- [Dynamic Blocks](#dynamic-blocks)
- [Examples](#examples)
- [License](#license)

---

## Installation

#### npm
```bash
npm install react-rambo
```

#### yarn
```bash
yarn add react-rambo
```

---

## Blocks
> `Blocks` is a new way of simple application development with React and Redux.

Old way (without `Blocks`): :disappointed_relieved:
```js
// actions.js
function startFetchingUserList() {
    return { type: 'users.list.start' }
}
function finishFetchingUserList(payload) {
    return { type: 'users.list.finish', payload }
}

// reducer.js
const initialState = {
    users: { list: { loading: false, value: null } }
}
function reducer(state = initialState, action) {
    switch (action.type) {
        case 'users.list.start':
            state.users.list = { ...state.users.list, loading: true }
            return { ...state }
        case 'users.list.finish':
            state.users.list = { ...state.users.list, loading: false, value: action.payload }
            return { ...state }
        default:
            return state
    }
}

// some.js
fetchUser(params) {
    return (dispatch, getState) => {
        dispatch(startFetchingUserList())
        return fetch('https://reqres.in/api/users').then(
                response => response.json()
        ).then(json => dispatch('finish', json.data))
    }
}

// SomeComponent.js
...
const mapStateToProps = (state) => ({
    userList: state.users.list,
})
const mapDispatchToProps = (dispatch) => ({
    getUserList: bindActionCreators(fetchUser, dispatch),
})
...
```
New way (with `Blocks`): :blush:
```js
import { block } from 'react-rambo'

const UserListBlock = block({
    name: 'UserList',
    initialState: { loading: false, value: null },
    reducer: {
        start: (state, action) => ({ ...state, loading: true }),
        finish: (state, action) => ({ ...state, loading: false, value: action.payload }),
    },
    methods: {
        get: (params) => (dispatch, getState) => {
            dispatch('start')
            return fetch('https://reqres.in/api/users').then(
                response => response.json()
            ).then(json => dispatch('finish', json.data))
        },
    },
})

// SomeComponent.js
...
const mapStateToProps = (state) => ({
    userList: state.users.list,
})
const mapDispatchToProps = (dispatch) => ({
    getUserList: bindActionCreators(UserListBlock.get, dispatch),
})
...
```

And now:

- All in one file.
- Less code.
- Easier.

`dispatch('start')` can be written down like `dispatch('#UserList.start')`.

*index.js* with combineReducers
```jsx
import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'

const rootReducer = combineReducers({
    users: combineReducers({
        list: UserListBlock._reducer,
    }),
})
const store = createStore(rootReducer, {}, applyMiddleware(thunk))

ReactDOM.render(
    <Provider store={store}><SomeComponent /></Provider>,
    document.getElementById('root'),
)
```

[back to top](#table-of-contents)

---

## Dynamic Blocks
Example:
```js
// blocks.js
import { dynamicBlock } from 'react-rambo'

const BannerListBlock = dynamicBlock({
    name: 'BannerList',
    initialState: { loading: false, value: null },
    index: 'type', // is an important parameter
    reducer: {
        start: (state, action) => ({ ...state, loading: true }),
        finish: (state, action) => ({ ...state, loading: false, value: action.payload }),
    },
    methods: {
        get: (params) => ((dispatch, getState) => {
            dispatch('start')
            return new Promise(resolve => {
                setTimeout(() => {
                    dispatch('finish', 'TEST')
                    resolve()
                }, 1000)
            })
        }),
    },
})

// MyComponent.js
class MyComponent extends Component {
    componentDidMount() {
        this.props.getBanner({ type: 'left' }) // A index (`type` in this case) must be present in the arguments.
        this.props.getBanner({ type: 'right' })
    }
    render() {
        const { banners } = this.props
        return <div>
            Left banner: {banners.left ? (banners.left.loading ? 'Loading...' : banners.left.value) : '---'}<br/>
            Right banner: {banners.right ? (banners.right.loading ? 'Loading...' : banners.left.value) : '---'}<br/>
        </div>
    }
}

const mapStateToProps = (state) => ({
    banners: state.banners,
})
const mapDispatchToProps = (dispatch) => ({
    getBanner: bindActionCreators(BannerListBlock.get, dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)
```

[back to top](#table-of-contents)

---

## Examples

* [Simple](https://github.com/expert-m/react-rambo/tree/master/examples/simple) ([Demo](https://expert-m.github.io/react-rambo/))


## License
MIT
