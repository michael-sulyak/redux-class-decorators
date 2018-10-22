import { DecoratorHelper, pathReducerMethods, toUnderscoreCase } from './utils'


export default function PlumbingReducerClass(prefix) {
  prefix = toUnderscoreCase(prefix)

  return function (target) {
    if (DecoratorHelper.isDecorated(target)) {
      return target
    }

    const reducerMap = pathReducerMethods(target, prefix)

    const reducer = (state = {}, action) => {
      if (!action || !reducerMap[action.type] || !action.meta || !('$index' in action.meta)) {
        return state
      }

      if (!(action.meta.$index in state)) {
        const getInitialState = DecoratorHelper.getStaticMethod(target, '$getInitialState')
        state[action.meta.$index] = getInitialState()
      }

      const partState = state[action.meta.$index]
      const newPartState = reducerMap[action.type](partState, action)

      if (newPartState !== partState) {
        if (newPartState === undefined) {
          delete state[action.meta.$index]
          return { ...state }
        }

        return {
          ...state,
          [action.meta.$index]: newPartState,
        }
      }

      return state
    }

    DecoratorHelper.setStaticMethod(target, '$reducer', reducer)
    DecoratorHelper.markAsDecorated(target)

    return target
  }
}
