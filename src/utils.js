export class DecoratorHelper {
  static errorText = 'The object can\'t be decorated.'

  static isDecorated(target) {
    if (!(target instanceof Function)) {
      throw new Error(DecoratorHelper.errorText)
    }

    if (target.__isDecorated) {
      console.warn(`"${target.name}" is already decorated.`)
      return true
    }

    return false
  }

  static markAsDecorated(target) {
    target.__isDecorated = true
  }

  static getStaticField(target, fieldName) {
    return target[fieldName]
  }

  static getStaticMethodNames(target) {
    let properties = Object.getOwnPropertyNames(target)
    let prototype = Object.getPrototypeOf(target)

    do {
      if (prototype === Object.prototype || !(prototype instanceof Function)) {
        break
      }

      properties = properties.concat(Object.getOwnPropertyNames(prototype))
    } while (prototype = Object.getPrototypeOf(prototype))

    return properties.filter(prop => (
        target[prop] instanceof Function && !prop.startsWith('_') && !prop.startsWith('$')
    ))
  }

  static getStaticMethod(target, methodName) {
    return target[methodName]
  }

  static setStaticMethod(target, methodName, method) {
    target[methodName] = method
  }
}

export function toUnderscoreCase(text) {
  return text.split(/(?=[A-Z])/).join('_').toUpperCase()
}

export function pathReducerMethods(target, prefix) {
  const methodNames = DecoratorHelper.getStaticMethodNames(target)
  const reducerMap = {}

  methodNames.forEach(methodName => {
    const actionType = `${prefix}__${toUnderscoreCase(methodName)}`
    reducerMap[actionType] = DecoratorHelper.getStaticMethod(target, methodName).bind(target)
    reducerMap[actionType].actionType = actionType
    DecoratorHelper.setStaticMethod(target, methodName, reducerMap[actionType])
  })

  return reducerMap
}

export function replaceActionType(action) {
  if (action.type instanceof Function) {
    action.type = action.type.actionType
  }
}
