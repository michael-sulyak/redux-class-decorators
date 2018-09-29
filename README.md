<h1 align="center">
    <img src="https://raw.githubusercontent.com/expert-m/react-rambo/master/logo.jpg" alt="react-rambo" />
    <br>
    react-rambo
</h1>

<h4 align="center">Develop your React applications quickly and easily!</h4>

<p align="center">
    <a href="https://www.npmjs.com/package/react-rambo"><img src="https://img.shields.io/npm/v/react-rambo.svg?style=flat-square" alt="NPM"></a>  <a href="https://scrutinizer-ci.com/g/expert-m/react-rambo/?branch=master"><img src="https://img.shields.io/scrutinizer/g/expert-m/react-rambo.svg?style=flat-square" alt="Scrutinizer Code Quality"></a>  <a href="https://scrutinizer-ci.com/g/expert-m/react-rambo/build-status/master"><img src="https://img.shields.io/scrutinizer/build/g/expert-m/react-rambo.svg?style=flat-square" alt="Build Status"></a>  <a href="https://github.com/expert-m/react-rambo/issues"><img src="https://img.shields.io/github/issues/expert-m/react-rambo.svg?style=flat-square" alt="GitHub Issues"></a>  <a href="https://david-dm.org/expert-m/react-rambo?type=peer"><img src="https://david-dm.org/expert-m/react-rambo/peer-status.svg?style=flat-square" alt="peerDependencies Status"></a>  <a href="https://gitter.im/expert_m/react-rambo"><img src="https://img.shields.io/badge/gitter-join_chat-blue.svg?style=flat-square" alt="Gitter"></a>  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License"></a>
</p>

<br>

## Table Of Contents
- [Installation](#installation)
    - [npm](#npm)
    - [yarn](#yarn)
- [How To Use](#how-to-use)
- [Ready Solutions (modules)](#ready-solutions-modules)
    - [modules.Apps](#modulesapps)
        - ["Blocks"](#blocks---kill-feature) - Killer feature!
        - ["Dynamic Blocks"](#dynamic-blocks)
    - [modules.Store (Redux)](#modulesstore-redux)
    - [modules.Router](#modulesrouter)
    - [modules.SSR](#modulesssr)
    - [modules.Requests](#modulesrequests)
    - [modules.Helmet](#moduleshelmet)
- [How To Create A New Module](#how-to-create-a-new-module)
- [License](#license)

---

## Installation

#### npm
```bash
$ npm install react-rambo
```

#### yarn
```bash
$ yarn add react-rambo
```

**If you want to use all `modules`:**

```bash
$ npm install react-rambo react-dom react-helmet redux react-redux react-router-config react-router-dom
$ npm install --save-dev express isomorphic-fetch
```

or

```bash
$ yarn add react-rambo react-dom react-helmet redux react-redux react-router-config react-router-dom
$ yarn add --dev express isomorphic-fetch
```
---

## How To Use
**Examples:**
* [First](https://github.com/expert-m/react-rambo/tree/master/examples/client) ([Demo](https://expert-m.github.io/react-rambo/))
* [Second](https://github.com/expert-m/react-rambo/tree/master/examples/ssr) (with SSR)

**react-rambo** includes many ready solutions (`modules`) for different purposes. A list of `modules` must be specified when creating `Core`.
```js
const config = {
    modules: [modules.Store, modules.Apps],
    apps: [...],
}

// Different variants of creation:
core = new Core(config)
core = Core.getInstance(config) // Use singleton pattern
core = Core.getInstance(() => config) // Calls a function if `Core` is not created
```
By adding modules you can change a behavior of your application.

Examples:

- [modules.Store](#modulesstore-redux), [modules.Apps](#modulesapps) - allows you to create `Redux` store through `Core`.
- [modules.Store](#modulesstore-redux), [modules.Apps](#modulesapps), [modules.SSR](#modulesssr) - now you can easily render your application on a server.
- [modules.Store](#modulesstore-redux), [modules.Apps](#modulesapps), [modules.SSR](#modulesssr), [modules.Helmet](#moduleshelmet), [modules.Router](#modulesrouter) - this adds data for document head (`title`, `meta`, etc) and routing via `react-router`.

*Example of using [modules.Store](#modulesstore-redux) and [modules.Apps](#modulesapps):*

**1. Create app.js**

*app.js:*
```js
import { base } from 'react-rambo'

export default class UsersApp extends base.BaseApp {
    name = 'users'
    mount(data) {
        describeApp(this, this.core.req)
        return true // Must return `true`. Otherwise the application will not be added.
    }
}

function describeApp(app, req) {
    app.addValues(...)
    app.addBlock(...)
    app.addBlock('list', {
        initialState: { loading: false, value: null },
        reducer: {
            'start': (state, action) => ({ ...state, loading: true }),
            'finish': (state, action) => ({
                ...state,
                loading: false,
                value: action.payload,
            }),
        },
        methods: {
            'get': (params) => (dispatch, getState) => {
                dispatch('start')
                return req.get('/users', params).then((response) => ( // See `modules.Requests`
                    response.json().then(json => dispatch('finish', json.data))
                })
            },
        },
    })
    ...
}
```

You can use a similar file structure:
```
my-app
├── node_modules
└── src
    ├── index.js
    └── apps
        └── users
            ├── components
            └── app.js
```

**2. Realize a component**

*UserList.js:*
```jsx
class UserList extends Component {
    componentDidMount() {
        this.props.getUserList({ 'page': 3 })
    }

    render() {
        const { userList } = this.props
        return (
            <React.Fragment>
                {userList.loading && 'Loading...'}
                {!!userList.value && userList.value.map(user => (
                    <div key={user.id}>
                        {user.first_name} {user.last_name}
                    </div>
                ))}
            </React.Fragment>
        )
    }
}

const core = Core.getInstance(coreConfig)
const mapStateToProps = (state) => ({ userList: state.users.list })
const mapDispatchToProps = (dispatch) => ({ getUserList: bindActionCreators(core.apps.users.list.get, dispatch) })
connect(mapStateToProps, mapDispatchToProps)(UserList)
```

**3. Change index.js**

*index.js:*
```jsx
import { Core } from 'react-rambo'

const core = Core.getInstance(coreConfig)

ReactDOM.render(
    <Provider store={core.store.createStore()}>
        <UserList/>
    </Provider>,
    document.getElementById('root'),
)
```

*coreConfig.js:*
```js
import { modules } from 'react-rambo'

const config = {
    modules: [modules.Store, modules.Apps],
    apps: [UsersApp],
}

export default config
```

[back to top](#table-of-contents)

---

## Ready Solutions (modules)
> Divide your application into small parts (`apps`)!
#### modules.Apps
Dependencies: `redux`, `redux-thunk`, [modules.Store](#modulesstore-redux).
```bash
$ npm install redux redux-thunk
```

##### "Blocks" - Kill feature!
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
            state.user.list = { ...state.user.list, loading: true }
            return { ...state }
        case 'users.list.finish':
            state.user.list = { ...state.user.list, loading: false, value: action.payload }
            return { ...state }
        default: return state
    }
}

// some.js
fetchUser(params) {
    return (dispatch, getState) => {
        dispatch(startFetchingUserList())
        return req.get('/users', params).then((data) => {
            dispatch(finishFetchingUserList(data.json.data))
        }
    }
}

// someComponent.js
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
core.apps.users.addBlock('list', {
    initialState: { loading: false, value: null },
    reducer: {
        'start': (state, action) => ({ ...state, loading: true }),
        'finish': (state, action) => ({ ...state, loading: false, value: action.payload }),
    },
    methods: {
        'get': (params) => (dispatch, getState) => {
            dispatch('start')
            return req.get('/users', params).then((data) => {
                dispatch('finish', data.json.data)
            })
        },
    },
})

// someComponent.js
...
const mapStateToProps = (state) => ({
    userList: state.users.list,
})
const mapDispatchToProps = (dispatch) => ({
    getUserList: bindActionCreators(core.apps.users.list.get, dispatch),
})
...
```

And now:

- All in one file.
- Less code.
- Easier.

* `dispatch('start')` can be written down like this:
`dispatch('^list.start')` or`dispatch('#users.list.start')`

[back to top](#table-of-contents)

---

##### "Dynamic Blocks"
Example:
```js
// app.js
...
core.apps.banners.addDynamicBlock('list', {
    initialState: { loading: false, value: null },
    index: 'type', // is an important parameter
    reducer: {
        'start': (state, action) => ({ ...state, loading: true }),
        'finish': (state, action) => ({ ...state, loading: false, value: action.payload }),
    },
    methods: {
        'get': (params) => ((dispatch, getState) => {
            dispatch('start')
            return new Promise(resolve => {
                setTimeout(() => {
                    dispatch('finish', 'TEST')
                    resolve()
                }, 1000);
            })
        }),
    },
})

// MyComponent.js
class MyComponent extends Component {
    componentDidMount() {
        this.props.getBanner({'type': 'left'}) // A index (`type` in this case) must be present in the arguments.
        this.props.getBanner({'type': 'right'})
    }
    render() {
        const { banners } = this.props
        return (<div>
            Left banner: {banners.left ? (banners.left.loading ? 'Loading...' : banners.left.value) : '---'}<br/>
            Right banner: {banners.right ? (banners.right.loading ? 'Loading...' : banners.left.value) : '---'}<br/>
        </div>)
    }
}

const core = Core.getInstance(getCoreConfig)
const mapStateToProps = (state) => ({
    banners: state.banners.list,
})
const mapDispatchToProps = (dispatch) => ({
    getBanner: bindActionCreators(core.apps.banners.list.get, dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)
```


[back to top](#table-of-contents)

---

#### modules.Store (Redux)
Dependencies: `redux`, `redux-thunk`.
```bash
$ npm install redux redux-thunk
```

Example:
```js
const core = new Core({
    modules: [modules.Store, ...],
    store: {
        initialState: {},
        middleware: [createLogger()], // logger for Redux
    }
})
```

See [React Redux](https://github.com/reduxjs/react-redux).

[back to top](#table-of-contents)

---

#### modules.Router
Dependencies: `react-router`, `react-router-config`, `react-router-dom`.
```bash
$ npm install react-router react-router-config react-router-dom
```

Example:
```js
const routes = [{
    component: AppRoot,
    routes: [{ path: '/', component: UserList }],
}]

const core = new Core({
    modules: [modules.Router, ...],
    routes: routes, // routes for SSR
})
```

See [React Router](https://github.com/ReactTraining/react-router).

[back to top](#table-of-contents)

---

#### modules.SSR
> Server-side rendering :sunglasses:.

Dependencies: `express`, `react-dom`, `serialize-javascript`.
```bash
$ npm install express react-dom serialize-javascript
```

- You have to install [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) if you want to use module [modules.Requests](#modulesrequests) in SSR:
```bash
$ npm install isomorphic-fetch
```

Example:
```js
require('isomorphic-fetch')

const express = require('express')
const app = express()

app.use('/', (req, res) => {
    const core = new Core(coreConfig)

    core.ssr.render(req, res).then(data => {
        res.render('./template.ejs', {
            initialState: serialize(data.props.store.getState(), {isJSON: true}),
            app: data.html,
            helmet: data.helmet,
        })
    })
})
```

[back to top](#table-of-contents)

---

#### modules.Requests
Dependencies: `isomorphic-fetch` (only for [modules.SSR](#modulesssr)).
```bash
$ npm install isomorphic-fetch
```

Example:
```js
const core = new Core({
    modules: [modules.Requests, ...],
    requests: {
        middlewares: {
            prepareData: (data) => {
                data.headers['Content-Type'] = 'application/json'
                data.body = data.body && JSON.stringify(data.body)
            },
            prepareResult: (response) => (
                response.json().then(json => ({
                    json,
                    response,
                    status: response.status,
                    ok: response.ok,
                }))
            ),
        },
        defaultHost: 'https://reqres.in/api', // now you can write: req.get('/users/59/')
    },
})

core.req.get('/users', params).then((data) => {
    console.log(data.ok)
    console.log(data.json)
    console.log(data.status)
    console.log(data.response)
})

core.req.put('https://example2.com/api/users/50', data, headers).then(...)
core.req.post('https://example2.com/api/users/50', data, headers).then(...)
core.req.path('https://example2.com/api/users/50', data, headers).then(...)
core.req.purge('https://example2.com/api/users/50', data, headers).then(...)

core.req.fetch('get', 'https://example2.com/api/users', data, headers).then(...)
```

[back to top](#table-of-contents)

---

#### modules.Helmet
> Adds `Helmet` data for [modules.SSR](#modulesssr).

Dependencies: `react-helmet`.
```bash
$ npm install react-helmet
```

See [React Helmet](https://github.com/nfl/react-helmet).

[back to top](#table-of-contents)

---

## How To Create A New Module
See [/src/modules/](https://github.com/expert-m/react-rambo/tree/master/src/modules).

[back to top](#table-of-contents)

---

## License
MIT
