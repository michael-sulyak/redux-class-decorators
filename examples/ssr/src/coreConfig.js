import { modules } from 'react-apps'
import { createLogger } from 'redux-logger'


export default function getCoreConfig() {
    const config = {
        modules: [
            modules.Store,
            modules.Request,
            modules.Apps,
            modules.Helmet,
            modules.Router,
        ],
        defaultHost: 'https://reqres.in/api',
        apps: [
            require('./apps/users/app').default,
        ],
        componentForSSR: require('./components/AppServer').default,
        routes: require('./routes').default,
    }

    if (global.IS_SERVER) {
        config.modules.push(modules.SSR)
    } else {
        config.store = {
            initialState: global.IS_SERVER ? {} : window.__INITIAL_STATE__,
            middleware: [createLogger()],
        }
    }

    return config
}
