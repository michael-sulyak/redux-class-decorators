import Core from '../Core'
import Requests from './Requests'


it('Add module `Requests`', () => {
    const core = new Core({
        modules: [Requests],
    })

    expect(core.hasModule('req')).toBeTruthy()
})


it('Test Requests._urlIsAbsolute()', () => {
    const req = new Requests({})

    expect(req._urlIsAbsolute('https://test.com')).toBeTruthy()
    expect(req._urlIsAbsolute('//test.com')).toBeTruthy()
    expect(req._urlIsAbsolute('://test.com')).toBeFalsy()
    expect(req._urlIsAbsolute('/test')).toBeFalsy()
})
