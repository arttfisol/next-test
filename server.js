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
    const user = await sql.query(`SELECT * FROM user WHERE email = '${body.email}' AND password = '${md5(body.password)}'`)
    if (!user.length) {
      res.json({ is_success: false })
    }
    res.json({ is_success: true })
  })

  app.post('/api/register', async (req, res) => {
    const body = req.body
    const user = await sql.query(`SELECT * FROM users WHERE username = '${body.username}' OR email = '${body.email}'`)
    if (user.length) {
      res.json({ is_success: false })
    }
    const regis = await sql.query(`INSERT INTO users VALUES ('', '${body.fname}', '${body.lname}', '${body.tel}', '${body.username}', '${body.email}', '${body.password}')`)
    res.json({ is_success: !!regis })
  })

  app.post('/api/room', async (req, res) => {
    const body = req.body
    const room = await sql.query(`SELECT * FROM users WHERE room_number='${body.room_number}'`)
    if (room.length) {
      console.log('room already exists')
      res.json({ is_success: false })
    }
    res.json({ is_success: false })
    const insertRoom = await sql.query(`INSERT INTO rooms VALUES ('', '${body.room_number}', '${body.room_type}', ${body.room_price})`)
    res.json({ is_success: !!insertRoom })
  })

  app.delete('/api/room', async (req, res) => {
    const body = req.body
    const delRoom = await sql.query(`DELETE FROM rooms WHERE id = '${body.room_number}'`)
    res.json({ is_success: !!delRoom })
  })

  app.get('*', (req, res) => {
    return handle(req, res)
  })

  http.listen(3000)
  console.log('listening port 3000')
})
