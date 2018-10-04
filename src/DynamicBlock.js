import Block from './Block'


export default class DynamicBlock extends Block {
    _checkBlockInfo() {
        if (!this._info.name || !this._info.initialState || !this._info.reducer || !this._info.methods || !this._info.index) {
            throw new Error('Wrong block settings!')
        }
    }

    _getMethod(methodName, params) {
        return (dispatch, getState) => {
            const patchedDispatch = this._getPatchedDispatch(dispatch, params)
            const patchedGetState = this._getPatchedGetState(getState, params)
            return this._info.methods[methodName](params)(patchedDispatch, patchedGetState)
        }
    }

    _getPatchedDispatch(dispatch, params) {
        return (type, payload) => {
            const indexValue = this._getIndexValue(params)

            const data = {
                type: `${this._getActionType(type)}[${indexValue}]`,
            }

            if (payload !== undefined) {
                data.payload = payload
            }

            return dispatch(data)
        }
    }

    _getIndexValue(params) {
        if (this._info.index instanceof Function) {
            return this._info.index(params)
        } else {
            return params[this._info.index]
        }
    }

    _getPatchedGetState(getState, params) {
        const state = getState()
        return state ? [this._getIndexValue(params)] : undefined
    }

    _reducer(state = {}, action) {
        state = state || {}

        if (action.type[action.type.length - 1] !== ']' || !this._checkName(action.type)) {
            return state
        }

        const methodName = action.type.slice(this._info.name.length + 1, action.type.indexOf('['))

        if (!(methodName in this._info.reducer)) {
            return state
        }

        const indexValue = action.type.slice(this._info.name.length + methodName.length + 2, -1)
        const partState = state[indexValue] || { ...this._info.initialState }
        const newPartState = this._info.reducer[methodName](partState, action)

        if (newPartState !== partState) {
            return {
                ...state,
                [indexValue]: newPartState,
            }
        }

        return state
    }
}
