import Core from '../../Core'
import AppsModule from './AppsModule'
import Store from '../Store'


it('new AppsModule', () => {
    const core = new Core({
        modules: [AppsModule, Store],
    })

    expect(core.hasModule('apps')).toBeTruthy()
})
