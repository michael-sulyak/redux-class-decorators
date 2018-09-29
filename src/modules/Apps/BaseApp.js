export default class BaseApp {
    name = undefined
    initialState = {}
    blocks = {}

    constructor(core) {
        this.core = core
        this.logger = this.core.logger.getWithPrefix(`apps.${this.name}`)
    }

    addValues(values) {
        BaseApp._updateDict(
            this.initialState,
            values,
        )

        return this
    }

    addBlock(blockName, block) {
        block.index = undefined
        return this._addBlock(blockName, block)
    }

    addDynamicBlock(blockName, block) {
        return this._addBlock(blockName, block)
    }

    _addBlock(blockName, block) {
        if (blockName in this) {
            this.logs.error(`Block '${blockName}' already exists.`)
            return this
        }

        if (block.index) {
            this.initialState[blockName] = {}
        } else {
            this.initialState[blockName] = block.initialState
        }

        this.blocks[blockName] = block

        this[blockName] = {}
        for (let methodName of Object.keys(block.methods)) {
            this[blockName][methodName] = (params) => {
                return this.getMethod(blockName, methodName, params)
            }
        }

        return this
    }

    getMethod(blockName, methodName, params) {
        const block = this._getBlock(blockName)

        if (!block || !(methodName in block.methods)) {
            this.logs.warn(`I can't get method '${this.name}.${blockName}.${methodName}'.`)
            return
        }

        return (dispatch, getState) => {
            const patchedDispatch = (type, payload) => {
                const newType = this._getActionType(blockName, type)

                const data = {
                    type: block.index ? `${newType}[${params[block.index]}]` : newType,
                }

                if (payload !== undefined) {
                    data.payload = payload
                }

                return dispatch(data)
            }

            const patchedGetState = () => {
                const state = getState()
                return state[this.name][blockName]
            }

            return block.methods[methodName](params)(patchedDispatch, patchedGetState)
        }
    }

    static _updateDict(first, second) {
        for (let key in second) {
            first[key] = second[key]
        }
    }

    _getBlock(blockName) {
        if (blockName in this.blocks) {
            return this.blocks[blockName]
        } else if (this.core.debug) {
            this.logs.warn(`I can't get block '${blockName}'.`)
        }
    }

    _getActionType(blockName, type) {
        switch (type[0]) {
            case '^': // Local
                return `${this.name}.${type.slice(1)}`

            case '#': // Global
                return type.slice(1)

            default:
                return `${this.name}.${blockName}.${type}`
        }
    }
}
