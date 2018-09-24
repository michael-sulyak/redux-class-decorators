import HelmetModule from './HelmetModule'
import Core from '../Core'


it('createStore', () => {
    const core = new Core({
        modules: [HelmetModule],
    })

    expect(core.hasModule('helmet')).toBeTruthy()
})
