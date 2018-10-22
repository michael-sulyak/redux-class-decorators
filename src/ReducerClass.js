import { DecoratorHelper, pathReducerMethods, toUnderscoreCase } from './utils'


export default function ReducerClass(prefix) {
  prefix = toUnderscoreCase(prefix)

  return function (target) {
    if (DecoratorHelper.isDecorated(target)) {
      return target
    }

    const reducerMap = pathReducerMethods(target, prefix)
    const initialState = DecoratorHelper.getStaticField(target, 'initialState')

    const reducer = (state = initialState, action) => (
      (action && reducerMap[action.type]) ? reducerMap[action.type](state, action) : state
    )

    DecoratorHelper.setStaticMethod(target, '$reducer', reducer)
    DecoratorHelper.markAsDecorated(target)

    return target
  }
}
