require('dotenv').config()
const next = require('next')
const md5 = require('md5')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const _ = require('lodash')

const dev = process.env.NODE_ENV !== 'production'
const appNext = next({ dev })

const app = express()
const handle = appNext.getRequestHandler()
const http = require('http').createServer(app)

const mysql = require('mysql')
const sql = mysql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DB
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

  app.get('/api/booking', (req, res) => {
    try {
      sql.query('SELECT * FROM booking', function (err, results) {
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

  app.get('/api/check-rooms', (req, res) => {
    try {
      const que = req.query
      console.log('que ', que)
      sql.query(`SELECT * FROM room WHERE branch= '${que.branch}'`, function (err, allRooms) {
        if (err) throw err
        sql.query(`SELECT * FROM booking WHERE ( check_in <= date_format('${que.check_in}', '%Y-%m-%d') AND check_out > date_format('${que.check_in}', '%Y-%m-%d') ) OR ( check_in >= date_format('${que.check_in}', '%Y-%m-%d') AND check_in < date_format('${que.check_out}', '%Y-%m-%d') )`, async (err, unAvailable) => {
          if (err) throw err
          console.log('allRooms before: ', allRooms)
          console.log('unAvailable : ', unAvailable)
          await _.forEach(unAvailable, (un) => {
            _.remove(allRooms, (rooms) => {
              return rooms.room_number === un.room_number && rooms.branch === un.branch
            })
          })
          const filteredRoom = []
          await _.forEach(allRooms, (room) => {
            if (!_.find(filteredRoom, { room_type: room.room_type })) {
              filteredRoom.push({
                room_type: room.room_type,
                room_price: room.room_price,
                branch: room.branch,
                room_number: [room.room_number]
              })
            } else {
              const indexFound = _.findIndex(filteredRoom, { room_type: room.room_type })
              filteredRoom[indexFound].room_number = [...filteredRoom[indexFound].room_number, room.room_number]
            }
          })
          console.log('filteredRoom', filteredRoom)
          res.json({
            is_success: true,
            data: filteredRoom
          })
        })
      })
    } catch (err) {
      console.log(err)
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

  app.get('/api/branch', (req, res) => {
    try {
      sql.query('SELECT * FROM branch', function (err, results) {
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
      sql.query(`SELECT * FROM room WHERE room_number='${body.room_number}' AND branch='${body.branch}'`, function (err, results) {
        if (err) throw err
        if (results.length) {
          console.log('Room Already Exists')
          return res.json({
            is_success: false,
            data: 'Room Already Exists'
          })
        }
        sql.query(`INSERT INTO room (room_number, room_type, room_price, available, branch) VALUES ('${body.room_number}', '${body.room_type}', ${body.room_price}, TRUE, '${body.branch}')`, function (err, result) {
          if (err) throw err
          console.log(`Insert Room Number ${body.room_number} Branch ${body.branch} Success`)
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
      sql.query(`DELETE FROM room WHERE room_number = '${body.room_number}' AND branch= '${body.branch}'`, function (err, result) {
        if (err) throw err
        console.log(`Delete Room Number ${body.room_number} Branch ${body.branch} Success`)
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
