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
  user: 'user',
  password: 'password',
  database: 'log'
})

sql.connect(function (err) {
  if (err) { console.log(err) } else { console.log('connected') }
})

appNext.prepare().then(async () => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(cors())

  app.get('/ping', (req, res) => {
    res.send('pong')
  })

  app.get('/api/hotels', (req, res) => {
    try {
      res.json({
        is_success: true,
        data: require('./json/hotel.json')
      })
    } catch (err) {
      res.json({
        is_success: false,
        data: err.message
      })
    }
  })

  app.get('/api/rooms', (req, res) => {
    try {
      sql.query('SELECT * FROM room', function (err, results) {
        if (err) throw err
        res.json({
          is_success: true,
          data: results
        })
      })
    } catch (err) {
      res.json({
        is_success: false,
        data: err.message
      })
    }
  })

  app.get('/api/room-types', (req, res) => {
    try {
      sql.query('SELECT * FROM rtype', function (err, results) {
        if (err) throw err
        res.json({
          is_success: true,
          data: results
        })
      })
    } catch (err) {
      res.json({
        is_success: false,
        data: err.message
      })
    }
  })

  app.post('/api/login', (req, res) => {
    try {
      const body = req.body
      sql.query(`SELECT * FROM users WHERE email = '${body.email}' AND password = '${md5(body.password)}'`, function (err, results) {
        if (err) throw err
        if (!results.length) {
          return res.json({ is_success: false })
        }
        return res.json({ is_success: true })
      })
    } catch (err) {
      res.json({
        is_success: false,
        data: err.message
      })
    }
  })

  app.post('/api/register', (req, res) => {
    try {
      const body = req.body
      sql.query(`SELECT * FROM users WHERE username = '${body.username}' OR email = '${body.email}'`, function (err, results) {
        if (err) throw err
        if (results.length) {
          return res.json({
            is_success: false,
            data: 'Username or Email Already Exists'
          })
        }
        sql.query(`INSERT INTO users (fname, lname, tel, birth, username, email, password) VALUES ('${body.fname}', '${body.lname}', '${body.tel}', '${body.birth}', '${body.username}', '${body.email}' , '${md5(body.password)}')`, function (err, result) {
          if (err) throw err
          res.json({ is_success: true })
        })
      })
    } catch (err) {
      res.json({
        is_success: false,
        data: err.message
      })
    }
  })

  app.post('/api/room', (req, res) => {
    try {
      const body = req.body
      sql.query(`SELECT * FROM room WHERE room_number='${body.room_number}'`, function (err, results) {
        if (err) throw err
        if (results.length) {
          console.log('Room Already Exists')
          res.json({
            is_success: false,
            data: 'Room Already Exists'
          })
        }
        sql.query(`INSERT INTO room (room_number, room_type, room_price) VALUES ('${body.room_number}', '${body.room_type}', ${body.room_price})`, function (err, result) {
          if (err) throw err
          console.log(`Insert Room Number ${body.room_number} Success`)
          sql.query('SELECT * FROM room', function (err, results) {
            if (err) throw err
            res.json({
              is_success: true,
              data: results
            })
          })
        })
      })
    } catch (err) {
      res.json({
        is_success: false,
        data: err.message
      })
    }
  })

  app.delete('/api/room', (req, res) => {
    try {
      const body = req.body
      sql.query(`DELETE FROM room WHERE room_number = '${body.room_number}'`, function (err, result) {
        if (err) throw err
        console.log(`Delete Room Number ${body.room_number} Success`)
        sql.query('SELECT * FROM room', function (err, results) {
          if (err) throw err
          res.json({
            is_success: true,
            data: results
          })
        })
      })
    } catch (err) {
      res.json({
        is_success: false,
        data: err.message
      })
    }
  })

  app.get('*', (req, res) => {
    return handle(req, res)
  })

  http.listen(3000)
  console.log('listening port 3000')
})
