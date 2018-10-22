import { DecoratorHelper, replaceActionType } from './utils'


export default function PlumbingActionClass(target) {
  if (DecoratorHelper.isDecorated(target)) {
    return target
  }

  const methodNames = DecoratorHelper.getStaticMethodNames(target)

  methodNames.forEach(methodName => {
    const method = DecoratorHelper.getStaticMethod(target, methodName)

    const newMethod = function () {
      const action = method(...arguments)

      if (action instanceof Function) {
        return async (dispatch, getState) => {
          const decoratedDispatch = (action) => {
            replaceActionType(action)
            addIndexInMeta(target, action, arguments)
            return dispatch(action)
          }
          return await action(decoratedDispatch, getState)
        }
      } else {
        replaceActionType(action)
        addIndexInMeta(target, action, arguments)
        return action
      }
    }

    DecoratorHelper.setStaticMethod(target, methodName, newMethod)
  })

  DecoratorHelper.markAsDecorated(target)
  return target
}

function addIndexInMeta(target, action, params) {
  if (!action) {
    return action
  }

  if (!action.meta) {
    action.meta = {}
  }

  if (action.meta.$index === undefined) {
    const getIndex = DecoratorHelper.getStaticMethod(target, '$getIndex')
    action.meta.$index = getIndex(...params)
  }

  return action
}
