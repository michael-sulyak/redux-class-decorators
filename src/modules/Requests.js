export default class Requests {
    name = 'req'
    defaultHost = ''
    middlewares = {}

    constructor(core) {
        this.core = core
    }

    mount(data) {
        const config = data.requests || {}
        this.defaultHost = config.defaultHost || this.defaultHost
        this.middlewares = config.middlewares || {}

        return true
    }

    get(path, data, headers) {
        let url = this._getURL(path)

        if (data && data instanceof Object) {
            const queryString = Object.keys(data).map(
                key => `${key}=${encodeURIComponent(data[ key ])}`
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

    fetch(method, url, body, headers, credentials) {
        headers = headers || {}

        const data = { method, url, headers, body, credentials }

        if (this.middlewares.prepareData) {
            this.middlewares.prepareData(data)
        }

        return global.fetch(url, data).then(response => {
            if (this.middlewares.prepareResult) {
                return this.middlewares.prepareResult(response)
            } else {
                return response
            }
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
