import { modules } from 'react-apps'
import UsersApp from './apps/users/app'
import { createLogger } from 'redux-logger'


const config = {
    modules: [
        modules.Store,
        modules.Request,
        modules.Apps,
    ],
    debug: true,
    defaultHost: 'https://reqres.in/api',
    store: {
        middleware: [createLogger()],
    },
    apps: [
        UsersApp,
    ],
}

export default config
