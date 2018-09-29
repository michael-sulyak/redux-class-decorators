import Core from './Core'
import Logger from './modules/Logger'
import Store from './modules/Store'
import HelmetModule from './modules/HelmetModule'
import Requests from './modules/Requests'
import SSR from './modules/SSR'
import AppsModule from './modules/Apps/AppsModule'
import BaseApp from './modules/Apps/BaseApp'
import Router from './modules/Router'


const modules = {
    Logger,
    Store,
    Helmet: HelmetModule,
    Requests,
    SSR,
    Apps: AppsModule,
    Router,
}

const base = {
    BaseApp,
}

export {
    Core,
    modules,
    base,
}
