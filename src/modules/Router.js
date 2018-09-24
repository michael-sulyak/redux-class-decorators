import { matchRoutes } from 'react-router-config'


export default class Router {
    name = 'router'

    constructor(core) {
        this.core = core
    }

    mount(data) {
        const core = this.core
        this.routes = data.routes

        core.asyncHandle('beforeRenderComponentOnServer', async (data) => {
            const {req} = data

            // Use PATH from url because of invalid query params processing
            // by react router if route has "exact: true"
            const matchingRoutes = matchRoutes(
                this.routes,
                req.url.split('?')[0],
            )

            for (const {route, match} of matchingRoutes) {
                const props = {
                    ...data.props,
                    match: match.params,
                    location: {
                        search: req.url.split('?')[1] || '',
                        path: req.url.split('?')[0],
                    },
                }

                await core.event('componentWillRenderOnServer', props)
                const componentWillRenderOnServer = route.component.componentWillRenderOnServer

                if (componentWillRenderOnServer instanceof Function) {
                   await componentWillRenderOnServer(core, props)
                }
            }
        })

        core.asyncHandle('afterRenderComponentOnServer', data => {
            const {res, props} = data

            if (props.context.url) {
                res.redirect(301, props.context.url)
            }

            const status = props.context.status || 200
            res.status(status)
        })

        return true
    }
}
