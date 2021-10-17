import { useState, useEffect } from 'react'
import { Grid, Stack, Snackbar, Alert } from '@mui/material'
import Header from '../../components/header'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'
import axios from 'axios'
import { forEach, get } from 'lodash'
import Router from 'next/router'
import BookingContainer from '../../components/booking'

export default function Pages () {
  const [booking, setBooking] = useState([])

  const [alert, setAlert] = useState(false)
  const [alertContent, setAlertContent] = useState('')
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setAlert(false)
  }

  useEffect(async () => {
    try {
      const resCookie = await axios('/api/get-cookie')
      const email = get(resCookie, 'data.cookies.email', false)
      if (!email) {
        return Router.push('/login')
      }
      if (!booking.length) {
        let resBooking = await axios('/api/booking', {
          method: 'GET',
          params: {
            email
          }
        })
        resBooking = resBooking.data
        if (resBooking.is_success) {
          await forEach(resBooking.data, element => {
            element.room_number = element.room_number.join(', ')
            element.check_in = element.check_in.split('T')[0]
            element.check_out = element.check_out.split('T')[0]
            setBooking(previousBooking => [...previousBooking, element])
          })
        } else {
          setAlert(true)
          setAlertContent(resBooking.data ? resBooking.data : 'Something Went Wrong!')
        }
      }
    } catch (err) {
      setAlert(true)
      setAlertContent('Something Went Wrong!')
    }
  }, [])

  const numberWithCommas = (num) => {
    return num.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return (
    <div style={{ backgroundImage: 'url("bg1.jpeg")', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Header />
      <br />
      <Grid container>
        <Grid item xs={2} />
        <Grid item xs={8} style={{ height: '85vh' }}>
          <PerfectScrollbar>
            <Stack>
              {
                    booking.map((book, index) => {
                      return (
                        <BookingContainer
                          branchName={book.branch_name}
                          roomNumber={book.room_number}
                          typeName={book.type_name}
                          checkIn={book.check_in}
                          checkOut={book.check_out}
                          price={numberWithCommas(book.price)}
                          key={index}
                        />
                      )
                    })
                }
            </Stack>
          </PerfectScrollbar>
        </Grid>
        <Grid item xs={2} />
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={alert} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
            {alertContent}
          </Alert>
        </Snackbar>
      </Grid>
    </div>
  )
}
