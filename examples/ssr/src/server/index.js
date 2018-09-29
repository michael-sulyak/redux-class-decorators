require('ignore-styles')
require('@babel/register')
require('isomorphic-fetch')

global.IS_SERVER = true

const path = require('path')
const express = require('express')
const serialize = require('serialize-javascript')
const serveStatic = require('serve-static')
const { Core } = require('react-apps')
const getCoreConfig = require('../coreConfig').default
const assets = require('../../build/asset-manifest.json')

const app = express()
const port = 3000

app.use('/static/', serveStatic(path.join(__dirname, '../../build/static')))

app.set('views', __dirname)
app.set('view engine', 'ejs')

app.use('/', (req, res) => {
    try {
        const core = new Core(getCoreConfig())

        core.ssr.render(req, res).then(data => {
            res.render('./template.ejs', {
                initialState: serialize(data.props.store.getState(), { isJSON: true }),
                assets,
                app: data.html,
                helmet: data.helmet,
            })
        })
    } catch (e) {
        console.log(e)
        res.status(500).send('Something broke!')
    }
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}... 👍`)
})
