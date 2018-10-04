export default class Block {
    constructor(blockInfo) {
        this._info = blockInfo
        this._checkBlockInfo(blockInfo)
        this._addMethodsInBlock(blockInfo)
        this._reducer = this._reducer.bind(this)
    }

    _checkBlockInfo() {
        if (!this._info.name || !this._info.initialState || !this._info.reducer || !this._info.methods) {
            throw new Error('Wrong block settings!')
        }
    }

    _addMethodsInBlock() {
        for (const methodName of Object.keys(this._info.methods)) {
            this[methodName] = (params) => {
                return this._getMethod(methodName, params)
            }
        }
    }

    _getMethod(methodName, params) {
        return (dispatch, getState) => {
            const patchedDispatch = this._getPatchedDispatch(dispatch)
            return this._info.methods[methodName](params)(patchedDispatch, getState)
        }
    }

    _getPatchedDispatch(dispatch) {
        return (type, payload) => {
            const data = {
                type: this._getActionType(type),
            }

            if (payload !== undefined) {
                data.payload = payload
            }

            return dispatch(data)
        }
    }

    _getActionType(type) {
        switch (type[0]) {
            case '#': // Global
                return type.slice(1)

            default:
                return `${this._info.name}.${type}`
        }
    }

    _reducer(state, action) {
        state = state || this._info.initialState

        if (!this._checkName(action.type)) {
            return state
        }

        const methodName = action.type.slice(this._info.name.length + 1)

        if (!methodName || !(methodName in this._info.reducer)) {
            return state
        }

        return this._info.reducer[methodName](state, action)
    }

    _checkName(actionType) {
        if (!actionType || actionType.length + 2 < this._info.name.length || actionType[this._info.name.length] !== '.') {
            return false
        }

        for (let i = 0; i < this._info.name.length; ++i) {
            if (this._info.name[i] !== actionType[i]) {
                return false
            }
        }

        return true
    }
}
