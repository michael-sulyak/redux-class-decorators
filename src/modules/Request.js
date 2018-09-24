
export default class Request {
    name = 'req'
    defaultHost = ''
    middleware = []

    constructor(core) {
        this.core = core
    }

    mount(data) {
        this.defaultHost = data.defaultHost || this.defaultHost
        this.middleware = [
            ...this.middleware,
            ...data.requestMiddleware || [],
        ]

        return true
    }

    get(path, data, headers) {
        let url = this._getURL(path)

        if (data instanceof Object) {
            const queryString = Object.keys(data).map(
                key => `${key}=${encodeURIComponent(data[key])}`
            ).join('&')

            url += '?' + queryString
        }

        return this.fetch('get', url, null, headers)
    }

    put(path, data, headers) {
        return this.fetch('put', this._getURL(path), data, headers)
    }

    post(path, data, headers) {
        return this.fetch('post', this._getURL(path), data, headers)
    }

    path(path, data, headers) {
        return this.fetch('path', this._getURL(path), data, headers)
    }

    purge(path, data, headers) {
        return this.fetch('delete', this._getURL(path), data, headers)
    }

    fetch(method, url, data, headers) {
        headers = headers || {}


        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json'
        }

        // TODO
        // const token = 'TEST'
        //
        // if (token) {
        //     headers['Authorization'] = `JWT ${token}`
        // }

        if (headers['Content-Type'] === 'application/json') {
            data = data ? JSON.stringify(data) : null
        }

        const requestData = {
            method: method,
            headers,
            body: data,
        }

        this.middleware.forEach(middleware => middleware(url, requestData))

        return fetch(url, requestData).then(response => {
            // if (response.status >= 500) {
            //     // if (!this.core.isSSR) {
            //     //     // notification.open({
            //     //     //     message: 'Ошибка!',
            //     //     //     description: 'Сервер временно не доступен. ' +
            //     //     //     'Пожалуйста, попробуйте отправить запрос позже!'
            //     //     // })
            //     // }
            //
            //     throw Error(response.statusText)
            // }

            return response.json().then(json => ({
                json: json,
                response: response,
                status: response.status,
                ok: response.ok,
            })).catch(() => ({
                response: response,
                status: response.status,
                ok: response.ok,
            }))
        })
    }

    _getURL(url) {
        if (!this.defaultHost) {
            return url
        }

        return this._urlIsAbsolute(url) ? url : this.defaultHost + url
    }

    _urlIsAbsolute(url) {
        const re = /^https?:\/\/|^\/\//i
        return re.test(url)
    }
}
