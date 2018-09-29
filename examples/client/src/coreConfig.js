import { modules } from 'react-rambo'
import UsersApp from './apps/users/app'
import { createLogger } from 'redux-logger'


const config = {
    modules: [
        modules.Store,
        modules.Requests,
        modules.Apps,
    ],
    debug: true,
    store: {
        middleware: [createLogger()],
    },
    apps: [
        UsersApp,
    ],
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
        defaultHost: 'https://reqres.in/api',
    }
}

export default config
