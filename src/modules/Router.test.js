import Router from './Router'
import Core from '../Core'


it('init', () => {
    const core = new Core({
        modules: [Router],
    })

    expect(core.hasModule('router')).toBeTruthy()
})
