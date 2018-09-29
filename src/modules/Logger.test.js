import Logger from './Logger'


it('test simple methods', () => {
    const logger = new Logger()
    const methodNames = ['warn', 'log', 'info', 'error']

    methodNames.forEach(methodName => {
        /** global: jest */
        logger.logging[methodName] = jest.fn()
        logger[methodName]()
        expect(logger.logging[methodName]).toHaveBeenCalled()
    })
})

it('logList()', () => {
    const logger = new Logger()

    /** global: jest */
    logger.logging.log = jest.fn()
    logger.logList()
    expect(logger.logging.log).toHaveBeenCalled()
})

it('logDict()', () => {
    const logger = new Logger()

    /** global: jest */
    logger.logging.log = jest.fn()
    logger.logDict()
    expect(logger.logging.log).toHaveBeenCalled()
})

it('getWithPrefix()', () => {
    const logger = new Logger()
    const newLogger = logger.getWithPrefix()

    /** global: jest */
    logger.logging.log = jest.fn()
    newLogger.log()
    expect(logger.logging.log).toHaveBeenCalled()
})
