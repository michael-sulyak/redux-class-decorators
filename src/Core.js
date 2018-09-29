import Logger from './modules/Logger'


class Core {
    moduleNames = []
    handlers = {}
    asyncHandlers = {}

    constructor(data) {
        this.debug = !!data.debug

        for (let module of data.modules || []) {
            this._registerModule(module)
        }

        // Must have logger
        if (this.logger === undefined) {
            this._registerModule(Logger)
        }

        const moduleNames = [...this.moduleNames]

        for (const moduleName of moduleNames) {
            const isMounted = this[moduleName].mount(data)

            if (!isMounted) {
                this._unresgisterModule(this[moduleName])
            }
        }
    }

    static getInstance(data) {
        if (!Core._instance) {
            Core._instance = new Core(data instanceof Function ? data() : data)
        }

        return Core._instance
    }

    _registerModule(Module) {
        const instance = new Module(this)

        if (instance.name in this) {
            throw new Error(`Module '${Module.name}' already exists.`)
        }

        this[instance.name] = instance
        this.moduleNames.push(instance.name)
    }

    _unresgisterModule(module) {
        const moduleName = module.name
        delete this[moduleName]

        const index = this.moduleNames.indexOf(moduleName)

        if (index > -1) {
            this.moduleNames.splice(index, 1)
        }

        if (this.debug) {
            this.logger.warn(`Module '${moduleName}' is removed from the core. 😭`, 'core')
        }
    }

    hasModule(moduleName) {
        return this.moduleNames.indexOf(moduleName) > -1
    }

    handle(eventName, handler) {
        if (!(eventName in this.handlers)) {
            this.handlers[eventName] = []
        }

        this.handlers[eventName].push(handler)
    }

    asyncHandle(eventName, handler) {
        if (!(eventName in this.asyncHandlers)) {
            this.asyncHandlers[eventName] = []
        }

        this.asyncHandlers[eventName].push(handler)
    }

    event(eventName, data) {
        if (eventName in this.handlers) {
            for (const handler of this.handlers[eventName]) {
                handler(data)
            }
        }
    }

    asyncEvent(eventName, data) {
        if (eventName in this.asyncHandlers) {
            return Promise.all(this.asyncHandlers[eventName].map(asyncHandler => (
                asyncHandler(data)
            )))
        }
    }

    about(logger) {
        logger = logger || this.logger.getWithPrefix('i')

        logger.log('About \'core\' 🔥')

        logger.logList('Modules', this.moduleNames)
        logger.logList('Handler events', Object.keys(this.handlers))

        for (const moduleName of this.moduleNames) {
            if (this[moduleName].about instanceof Function) {
                logger.log('')
                logger.log(`About 'core.${moduleName}' 🔥`)
                this[moduleName].about(logger)
            }
        }

        logger.log('')
    }
}

export default Core
