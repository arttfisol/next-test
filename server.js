const next = require('next')
const md5 = require('md5')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const dev = process.env.NODE_ENV !== 'production'
const appNext = next({ dev })

const app = express()
const handle = appNext.getRequestHandler()
const http = require('http').createServer(app)

const mysql = require('mysql')
const sql = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'log'
})

appNext.prepare().then(async () => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(cors())

  await sql.connect()
  app.get('/ping', (req, res) => {
    res.send('pong')
  })

  app.get('/api/hotels', (req, res) => {
    res.json(require('./json/hotel.json'))
  })

  app.get('/api/rooms', (req, res) => {
    res.json(require('./json/room.json'))
  })

  app.post('/api/login', async (req, res) => {
    const body = req.body
    const user = await sql.query(`SELECT * FROM user WHERE email=${body.email} AND password=${md5(body.password)}`)
    if (!user.length) {
      res.json({ is_success: false })
    }
    res.json({ is_success: true })
  })

  app.get('*', (req, res) => {
    return handle(req, res)
  })

  http.listen(3000)
  console.log('listening port 3000')
})
