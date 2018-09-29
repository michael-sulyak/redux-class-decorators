export default class AppsModule {
    name = 'apps'
    appNames = []
    initialState = {}

    constructor(core) {
        this.core = core
    }

    mount(data) {
        const core = this.core
        this.logger = core.logger.getWithPrefix(this.name)

        for (const app of data.apps || []) {
            this._registerApp(app)
        }

        for (const appName of this.appNames) {
            this[ appName ].mount(data)
        }

        core.handle('beforeCreateStore', (data) => {
            for (const appName of this.appNames) {
                if (appName in data.preloadedState) {
                    continue
                }

                data.preloadedState[ appName ] = { ...this[ appName ].initialState }
            }
        })

        if (core.store) {
            this._addReducerInStore()
        } else {
            this.logger.warn('\'core.store\' not found.')
        }

        return true
    }

    _registerApp(App) {
        const instance = new App(this.core)

        if (instance.name in this) {
            this.logger.error(`App '${App.name}' already exists.`)
            return
        }

        // Save app
        this[ instance.name ] = instance
        this.appNames.push(instance.name)

        this.initialState[ instance.name ] = {}
    }

    _addReducerInStore() {
        this.core.store.addReducer((state, action) => {
            const [ appName, blockName, actionName ] = action.type.split('.')

            if (!(this.appNames.includes(appName))) {
                return state
            }

            const block = this._getBlock(appName, blockName)
            const originActionName = actionName.split('[')[ 0 ]

            if (!block || !(originActionName in block.reducer) || !actionName) {
                return state
            }

            if (block.index) { // For dynamic blocks
                const index = actionName.slice(actionName.indexOf('[') + 1, -1)

                if (state[ appName ][ blockName ][ index ] === undefined) {
                    state[ appName ][ blockName ][ index ] = { ...block.initialState }
                }

                const partState = state[ appName ][ blockName ][ index ]

                const newPartState = block.reducer[ originActionName ](
                    partState,
                    action,
                )

                if (newPartState !== partState) {
                    state[ appName ][ blockName ] = {
                        ...state[ appName ][ blockName ],
                        [ index ]: newPartState,
                    }

                    return { ...state }
                }
            } else { // For blocks
                const partState = state[ appName ][ blockName ]

                const newPartState = block.reducer[ actionName ](
                    partState,
                    action,
                )

                if (newPartState !== partState) {
                    state[ appName ][ blockName ] = newPartState
                    return { ...state }
                }
            }

            return state
        })
    }

    _getBlock(appName, blockName) {
        if (this.appNames.includes(appName) && blockName in this[ appName ].blocks) {
            return this[ appName ].blocks[ blockName ]
        } else if (this.core.debug) {
            this.logger.warn(`I can't get block 'core.apps.${appName}.${blockName}'.`)
        }
    }

    about(logger) {
        logger.logList('Apps', this.appNames)
    }
}
