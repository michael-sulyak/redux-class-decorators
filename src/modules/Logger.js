export default class Logger {
    name = 'logger'
    logging = console

    mount(data) {
        if (data.logging !== undefined) {
            this.logging = data.logging
        }

        return true
    }

    warn(msg, prefix) {
        this.logging.warn(`${this._getPrefix(prefix)}${msg}`)
    }

    log(msg, prefix) {
        this.logging.log(`${this._getPrefix(prefix)}${msg}`)
    }

    info(msg, prefix) {
        this.logging.info(`${this._getPrefix(prefix)}${msg}`)
    }

    error(msg, prefix) {
        this.logging.error(`${this._getPrefix(prefix)}${msg} 😱`)
    }

    logList(name, list, prefix) {
        list = list || []

        this.log(`${name} (${list.length}): [`, prefix)
        for (let item of list) {
            this.log(`  ${item},`, prefix)
        }
        this.log(']', prefix)
    }

    logDict(name, dict, prefix, format) {
        dict = dict || {}

        this.log(`${name}: {`, prefix, format)
        for (let key of Object.keys(dict)) {
            this.log(`  '${key}': ${dict[key]}},`, prefix, format)
        }
        this.log('}', prefix, format)
    }

    getWithPrefix(prefix) {
        return {
            warn: msg => this.warn(msg, prefix),
            log: msg => this.log(msg, prefix),
            info: msg => this.info(msg, prefix),
            error: msg => this.error(msg, prefix),
            logList: (msg, list) => this.logList(msg, list, prefix),
            logDict: (msg, dict) => this.logDict(msg, dict, prefix),
        }
    }

    _getPrefix(moduleName) {
        return moduleName ? `[${moduleName}] ` : ''
    }
}
