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

const port = process.env.PORT || 3000
sql.connect(function (err) {
  if (err) { console.log(err) } else { console.log('connected') }
})

const cookie = require('cookie')
const cookieOptions = {
  sameSite: 'none',
  secure: true,
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7 // 1 week
}

const queryCommands = {
  getRooms: 'SELECT r.id, r.room_number, r.type_id, t.type_name, r.branch_id,b.branch_name, t.price, t.detail FROM room r LEFT JOIN rtype t ON r.type_id = t.type_id LEFT JOIN branch b ON r.branch_id = b.branch_id',
  getBooking: 'SELECT book.id, book.room_number, room.type_id, room.type_name, book.branch_id, room.branch_name, book.check_in, book.check_out, book.email, room.price FROM booking book LEFT JOIN ( SELECT r.id, r.room_number, r.type_id, t.type_name, r.branch_id,b.branch_name, t.price, t.detail FROM room r LEFT JOIN rtype t ON r.type_id = t.type_id LEFT JOIN branch b ON r.branch_id = b.branch_id) room ON book.room_number = room.room_number AND book.branch_id = room.branch_id'
}

const now = new Date()
const changeDate = (date) => {
  const offset = now.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString()
}

let offsetTz = now.getTimezoneOffset() / 60
let prefixTz = '-'
if (offsetTz <= 0) {
  prefixTz = '+'
  offsetTz *= -1
}
const numTz = prefixTz + offsetTz.toString().padStart(2, '0') + ':00'

appNext.prepare().then(async () => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(cors())

  app.get('/ping', (req, res) => {
    res.send('pong')
  })

  app.get('/api/logout', (req, res) => {
    const cookies = []
    cookies.push(cookie.serialize('email', '', { maxAge: 0 }))
    cookies.push(cookie.serialize('is_admin', '', { maxAge: 0 }))
    res.setHeader('Set-Cookie', cookies)
    res.json({ is_success: true })
  })

  app.get('/api/get-cookie', (req, res) => {
    return res.json({ cookies: cookie.parse(req.headers.cookie || '') })
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
      sql.query(queryCommands.getRooms, function (err, results) {
        if (err) throw err
        console.log('data: ', results)
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
      const where = req.query.email ? ` WHERE email= '${req.query.email}'` : ''
      sql.query(`${queryCommands.getBooking}${where} ORDER by check_in DESC`, async function (err, results) {
        if (err) throw err
        const filteredBooking = []
        await _.forEach(results, (booking) => {
          console.log('booking: ', booking)
          if (!_.find(filteredBooking, { check_in: changeDate(booking.check_in), check_out: changeDate(booking.check_out), email: booking.email, branch_id: booking.branch_id, type_id: booking.type_id })) {
            filteredBooking.push({
              room_number: [booking.room_number],
              check_in: changeDate(booking.check_in),
              check_out: changeDate(booking.check_out),
              branch_id: booking.branch_id,
              branch_name: booking.branch_name,
              type_id: booking.type_id,
              type_name: booking.type_name,
              email: booking.email,
              price: booking.price
            })
          } else {
            const indexFound = _.findIndex(filteredBooking, { check_in: changeDate(booking.check_in), check_out: changeDate(booking.check_out), email: booking.email, branch_id: booking.branch_id, type_id: booking.type_id })
            filteredBooking[indexFound].room_number = [...filteredBooking[indexFound].room_number, booking.room_number]
            filteredBooking[indexFound].price += booking.price
          }
        })
        res.json({
          is_success: true,
          data: filteredBooking
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
      sql.query(`${queryCommands.getRooms} WHERE r.branch_id= '${que.branch_id}'`, function (err, allRooms) {
        if (err) throw err
        sql.query(`${queryCommands.getBooking} WHERE ( DATE_FORMAT(CONVERT_TZ(book.check_in, '+00:00' , ${numTz}), '%Y-%m-%d') <= DATE_FORMAT('${que.check_in}', '%Y-%m-%d') AND DATE_FORMAT(CONVERT_TZ(book.check_out, '+00:00' , ${numTz}), '%Y-%m-%d') > DATE_FORMAT('${que.check_in}', '%Y-%m-%d') ) OR ( DATE_FORMAT(CONVERT_TZ(book.check_in, '+00:00' , ${numTz}), '%Y-%m-%d') >= DATE_FORMAT('${que.check_in}', '%Y-%m-%d') AND DATE_FORMAT(CONVERT_TZ(book.check_in, '+00:00' , ${numTz}), '%Y-%m-%d') < DATE_FORMAT('${que.check_out}', '%Y-%m-%d') )`, async (err, unAvailable) => {
          if (err) throw err
          console.log('allRooms before: ', allRooms)
          console.log('unAvailable : ', unAvailable)
          await _.forEach(unAvailable, (un) => {
            _.remove(allRooms, (rooms) => {
              return rooms.room_number === un.room_number && rooms.branch_id === un.branch_id
            })
          })
          const filteredRoom = []
          await _.forEach(allRooms, (room) => {
            if (!_.find(filteredRoom, { type_id: room.type_id })) {
              filteredRoom.push({
                type_name: room.type_name,
                type_id: room.type_id,
                room_price: room.price,
                branch_name: room.branch_name,
                branch_id: room.branch_id,
                detail: room.detail,
                room_number: [room.room_number]
              })
            } else {
              const indexFound = _.findIndex(filteredRoom, { type_id: room.type_id })
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
        if (err) {
          throw err
        }
        if (!results.length) {
          return res.json({ is_success: false, data: 'email or password is incorrect!' })
        }
        const cookies = []
        cookies.push(cookie.serialize('email', body.email, cookieOptions))
        cookies.push(cookie.serialize('is_admin', body.email.includes('admin'), cookieOptions))
        res.setHeader('Set-Cookie', cookies)
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
      sql.query(`SELECT * FROM room WHERE room_number='${body.room_number}' AND branch_id=${body.branch_id}`, function (err, results) {
        if (err) throw err
        if (results.length) {
          console.log('Room Already Exists')
          return res.json({
            is_success: false,
            data: 'Room Already Exists'
          })
        }
        sql.query(`INSERT INTO room (room_number, type_id, branch_id) VALUES ('${body.room_number}', ${body.type_id}, ${body.branch_id})`, function (err, result) {
          if (err) throw err
          console.log(`Insert Room Number ${body.room_number} Branch ${body.branch_id} Success`)
          sql.query(queryCommands.getRooms, function (err, results) {
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

  app.post('/api/booking', async (req, res) => {
    try {
      const body = req.body
      const rooms = body.room_ids
      for (let i = 0; i < rooms.length; i++) {
        sql.query(`INSERT INTO booking (room_number, branch_id, check_in, check_out, email) VALUES ('${rooms[i]}', '${body.branch_id}', '${body.check_in}', '${body.check_out}', '${body.email}')`, function (err, result) {
          if (err) throw err
        })
      }
      res.json({ is_success: true })
    } catch (err) {
      res.json({
        is_success: false,
        data: err.message
      })
    }
  })

  app.put('/api/room', (req, res) => {
    try {
      const body = req.body
      sql.query(`UPDATE room SET room_number='${body.room_number}', type_id=${body.type_id} WHERE room_number='${body.old_room_number}' AND branch_id=${body.branch_id}`, function (err, result) {
        if (err) throw err
        console.log(`Update Room Number (Old) ${body.old_room_number} Branch ${body.branch_id} Success`)
        sql.query(queryCommands.getRooms, function (err, results) {
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

  app.delete('/api/room', (req, res) => {
    try {
      const body = req.body
      sql.query(`DELETE FROM room WHERE room_number = '${body.room_number}' AND branch_id= '${body.branch_id}'`, function (err, result) {
        if (err) throw err
        console.log(`Delete Room Number ${body.room_number} Branch ${body.branch_id} Success`)
        sql.query(queryCommands.getRooms, function (err, results) {
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

  http.listen(port)
  console.log('listening port ' + port)
})
