import Core from './Core'


it('core.getInstance()', () => {
    const core1 = Core.getInstance({})
    const core2 = Core.getInstance({})

    expect(core1).toEqual(core2)
})

it('core._registerModule()', () => {
    let mainData = {}

    class TestModule {
        name = 'test'

        constructor(core) {
            this.core = core
        }

        mount(data) {
            expect(data).toEqual(mainData)
            return true
        }
    }

    mainData.modules = [
        TestModule
    ]

    const core = new Core(mainData)

    expect(core.moduleNames).toContain('test')
    expect(core.test.name).toEqual('test')
    expect(core.test.core).toEqual(core)
})

it('core.hasModule()', () => {
    class TestModule {
        name = 'test'

        mount() {
            return true
        }
    }

    const core = new Core({
        modules: [TestModule],
    })


    expect(core.hasModule('test')).toBeTruthy()
    expect(core.hasModule('test2')).toBeFalsy()
})

it('core.event() and core.handle()', () => {
    const core = new Core({})
    let flag = false

    core.handle('test event', data => {
        flag = data.x
    })

    core.event('test event', { x: true })

    expect(flag).toBeTruthy()
})

it('core.asyncEvent() and core.asyncHandle()', async () => {
    const core = new Core({})
    let flag = false

    core.asyncHandle('test event', data => {
        return new Promise(resolve => {
            setTimeout(() => {
                flag = data.x
                resolve()
            })
        })
    })

    await core.asyncEvent('test event', { x: true })

    expect(flag).toBeTruthy()
})
