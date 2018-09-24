import { createElement } from 'react'
import { renderToString } from 'react-dom/server'


export default class SSR {
    name = 'ssr'
    componentForSSR = null

    constructor(core) {
        this.core = core
    }

    mount(data) {
        this.componentForSSR = data.componentForSSR
        return !!this.componentForSSR
    }

    async render(req, res) {
        const core = this.core
        const data = {
            props: {
                location: req.url,
                context: {},
            },
            req,
            res,
        }

        await core.asyncEvent('beforeCreateElementOnServer', data)
        const element = createElement(this.componentForSSR, data.props)

        await core.asyncEvent('beforeRenderComponentOnServer', data)
        data.html = renderToString(element)
        await core.asyncEvent('afterRenderComponentOnServer', data)

        return new Promise(resolve => resolve(data))
    }
}
