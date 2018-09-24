import Core from '../Core'
import Request from './Request'


it('new Request', () => {
    const core = new Core({
        modules: [Request],
    })

    expect(core.hasModule('req')).toBeTruthy()
})
