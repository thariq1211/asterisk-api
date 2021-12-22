// server.js
const { createServer } = require('https')
// const cors = require('cors')
const { parse } = require('url')
const next = require('next')
const fs = require('fs');
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const httpsOptions = {
  key: fs.readFileSync("/etc/letsencrypt/live/e-verify.alpabit.com/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/e-verify.alpabit.com/cert.pem"),
};



app.prepare().then(() => {
  // use(cors())
  createServer(httpsOptions, (req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    if (pathname === '/a') {
      app.render(req, res, '/a', query)
    } else if (pathname === '/b') {
      app.render(req, res, '/b', query)
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(3007, (err) => {
    if (err) throw err
    console.log('> Ready on https://localhost:3007')
  })
})
