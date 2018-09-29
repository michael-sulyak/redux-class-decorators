import { modules } from 'react-rambo'
import { createLogger } from 'redux-logger'


export default function getCoreConfig() {
    const config = {
        modules: [
            modules.Store,
            modules.Requests,
            modules.Apps,
            modules.Helmet,
            modules.Router,
        ],
        apps: [
            require('./apps/users/app').default,
        ],
        componentForSSR: require('./components/AppServer').default,
        routes: require('./routes').default,
        requests: {
            middlewares: {
                prepareData: (data) => {
                    if (!data.headers['Content-Type']) {
                        data.headers['Content-Type'] = 'application/json'
                    }

                    if (data.body && data.headers['Content-Type'] === 'application/json') {
                        data.body = JSON.stringify(data.body)
                    }
                },
                prepareResult: (response) => {
                    if (response.status >= 500) {
                        console.log('Error!')
                        throw Error(response)
                    }

                    return response.json().then(json => ({
                        json: json,
                        response: response,
                        status: response.status,
                        ok: response.ok,
                    }))
                },
            },
            defaultHost: 'https://reqres.in/api',
        }
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
