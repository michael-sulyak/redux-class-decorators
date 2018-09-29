import Router from './Router'
import Core from '../Core'


it('Add module `Router`', () => {
    const core = new Core({
        modules: [Router],
    })

    expect(core.hasModule('router')).toBeTruthy()
})
