import Core from '../Core'
import SSR from './SSR'


it('render', async () => {
    let isRendered = false

    const component = props => {
        isRendered = true
        return 'html'
    }

    const core = new Core({
        modules: [SSR],
        componentForSSR: component,
    })

    await core.ssr.render(
        () => {
        },
        () => {
        },
    ).then(data => {
        expect(data.html).toEqual('html')
    })

    expect(isRendered).toBeTruthy()
})
