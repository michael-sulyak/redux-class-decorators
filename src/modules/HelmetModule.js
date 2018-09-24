import { Helmet } from 'react-helmet'


export default class HelmetModule {
    name = 'helmet'

    constructor(core) {
        this.core = core
    }

    mount(data) {
        this.core.asyncHandle('afterRenderComponentOnServer', data => {
            data.helmet = Helmet.renderStatic()
        })

        return true
    }
}
