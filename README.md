# react-apps
> Develop your React applications quickly and easily!

[![NPM](https://nodei.co/npm/react-apps.png?compact=true)](https://www.npmjs.com/package/react-apps)

[![NPM](https://img.shields.io/npm/v/react-apps.svg?style=flat-square)](https://www.npmjs.com/package/react-apps)  [![GitHub Issues](https://img.shields.io/github/issues/expert-m/react-apps.svg?style=flat-square)](https://github.com/expert-m/react-apps/issues)   [![Gitter](https://img.shields.io/badge/gitter-join_chat-blue.svg?style=flat-square)](https://gitter.im/expert-m/react-apps)  [![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)


## Table of content
- [Installation](#installation)
    - [npm](#npm)
    - [yarn](#yarn)
- [How To Use](#how-to-use)
- [Ready Solutions (modules)](#ready-solutions-modules)
    - [modules.Apps](#modules.apps)
        - ["Blocks"](#blocks---kill-feature) - Killer feature!
        - ["Dynamic Blocks"](#dynamic-blocks)
    - [modules.Store (Redux)](#modules.store-redux)
    - [modules.Router](#modules.router)
    - [modules.SSR](#modules.ssr)
    - [modules.Request](#modules.request)
    - [modules.Helmet](#modules.helmet)
- [How To Create A New Module](#how-to-create-a-new-module)
- [License](#license)

---

## Installation

#### npm
```bash
npm install react-apps
```

#### yarn
```bash
yarn add react-apps
```
---

## How To Use
Examples: [first](https://github.com/expert-m/react-apps/tree/master/examples/client), [second](https://github.com/expert-m/react-apps/tree/master/examples/ssr) (with SSR).

**react-apps** includes many ready solutions (`modules`) for different purposes. A list of `modules` must be specified when creating `Core`.
```js
const config = {
    modules: [modules.Store, modules.Apps],
    apps: [...],
}

// Different variants of creation:
core = new Core(config)
core = Core.getInstance(config) // Singleton pattern
core = Core.getInstance(() => config) // Calls the function if `Core` is not created
```
By adding modules you can change a behavior of your application.

Example:

- [modules.Store](#modules.store), [modules.Apps](#modules.apps) - allows you to create `Redux` store through `Core`.
- [modules.Store](#modules.store), [modules.Apps](#modules.apps), [modules.SSR](#modules.ssr) - now you can easily render a component on your server.
- [modules.Store](#modules.store), [modules.Apps](#modules.apps), [modules.SSR](#modules.ssr), [modules.Helmet](#modules.helmet), [modules.Router](#modules.router) - this adds data for document head and routing via `react-router`.

*Example of using [modules.Store](#modules.store) and [modules.Apps](#modules.apps):*

**1. Create app.js**

*app.js:*
```js
import { base } from 'react-apps'

export default class UsersApp extends base.BaseApp {
    name = 'users'
    mount(data) {
        describeApp(this, this.core.req)
        return true
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
            'get': (params) => ((dispatch, getState) => {
                dispatch('start')
                return req.get('/users', params).then((data) => {
                    dispatch('finish', data.json.data)
                })
            }),
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

**2. Realize component**

*UserList.js:*
```jsx
class UserList extends Component {
    componentDidMount() {
        this.props.getUserList({'page': 3})
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
import { Core } from 'react-apps'

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
import { modules } from 'react-apps'

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
Dependencies: `redux`, `redux-thunk`, [modules.Store](#modules.store).
```bash
npm install redux redux-thunk
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
    user: { list: { loading: false, value: null } }
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
            dispatch(finishFetchingUserList(payload))
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
app.addBlock('list', {
    initialState: { loading: false, value: null },
    reducer: {
        'start': (state, action) => ({ ...state, loading: true }),
        'finish': (state, action) => ({ ...state, loading: false, value: action.payload }),
    },
    methods: {
        'get': (params) => ((dispatch, getState) => {
            dispatch('start')
            return req.get('/users', params).then((data) => {
                dispatch('finish', data.json.data)
            })
        }),
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

[back to top](#table-of-contents)


##### "Dynamic Blocks"
Example:
```js
// app.js
...
app.addDynamicBlock('banner', {
    initialState: { loading: false, value: null },
    index: 'type',
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
        this.props.getBanner({'type': 'left'})
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
    banner: state.banners.banner,
})
const mapDispatchToProps = (dispatch) => ({
    getBanner: bindActionCreators(core.apps.banners.banner.get, dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)

```


[back to top](#table-of-contents)

---

#### modules.Store (Redux)
Dependencies: `redux`, `redux-thunk`.
```bash
npm install redux redux-thunk
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
npm install react-router react-router-config react-router-dom
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
npm install express react-dom serialize-javascript
```

- Standard modules use [express](https://github.com/expressjs/express) for SSR. Install [express](https://github.com/expressjs/express) if needed:
```bash
npm install express
```

- You have to install [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) if want use module [modules.Request](#modules.request) in SSR:
```bash
npm install isomorphic-fetch
```

Example:
```js
require('isomorphic-fetch')

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

#### modules.Request
Dependencies: `isomorphic-fetch` (only for [modules.SSR](#modules.ssr)).
```bash
npm install isomorphic-fetch
```

Example:
```js
const core = new Core({
    modules: [modules.Request, ...]
    requestMiddleware: [(requestDataForFetch) => {}],
    defaultHost: 'https://example.com/api/',
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
> Adds `Helmet` data for [modules.SSR](#modules.ssr).

Dependencies: `react-helmet`.
```bash
npm install react-helmet
```

See [React Helmet](https://github.com/nfl/react-helmet).

[back to top](#table-of-contents)

---

## How To Create A New Module
See [/src/modules/](https://github.com/expert-m/react-apps/tree/master/src/modules).

[back to top](#table-of-contents)

---

## License
MIT
