import HelmetModule from './HelmetModule'
import Core from '../Core'
import { Helmet } from 'react-helmet'


it('Add module', () => {
    const core = new Core({
        modules: [HelmetModule],
    })

    expect(core.hasModule('helmet')).toBeTruthy()
})

it('Create store', async () => {
    const core = new Core({
        modules: [HelmetModule],
    })

    const data = {}

    Helmet.canUseDOM = false
    await core.asyncEvent('afterRenderComponentOnServer', data)

    expect(data.helmet).toBeDefined()
})
