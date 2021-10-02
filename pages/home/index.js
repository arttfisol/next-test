import { useState, useEffect } from 'react'
import { Grid, Stack, Select, FormControl, InputLabel, MenuItem, TextField, OutlinedInput, Box, Paper, Snackbar, Alert } from '@mui/material'
import { LocalizationProvider, DateRangePicker } from '@mui/lab'
import axios from 'axios'
import AdapterDayJS from '@mui/lab/AdapterDayJS'
import HotalContainer from '../../components/hotelContainer'
import SkeletonHotelContainer from '../../components/skeleton/hotelContainer'
import mockHotel from '../../json/hotel.json'
import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'

const now = new Date()

export default function Pages () {
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState({
    hotels: [],
    location: 'huahin',
    inout: [new Date(), now.setDate(now.getDate() + 1)],
    number: 1
  })

  const [alert, setAlert] = useState(false)
  const [alertContent, setAlertContent] = useState('')
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setAlert(false)
  }

  const handleChange = (prop) => (event) => {
    setValues({
      ...values, [prop]: event.target.value
    })
  }

  const handleDateChange = (prop) => (event) => {
    try {
      console.log(values.inout)
      setValues({
        ...values, [prop]: [event[0].toISOString(), event[1].toISOString()]
      })
    } catch (err) {}
  }

  useEffect(async () => {
    try {
      setLoading(true)
      let response = await axios('/api/hotels')
      response = response.data
      if (response.is_success) {
        setValues({
          ...values, hotels: response.data
        })
        const timeout = 2.5 * 1000 // 2.5sec
        setTimeout(() => {
          setLoading(false)
        }, timeout)
      } else {
        setAlert(true)
        setAlertContent(response.data ? response.data : 'Something Went Wrong!')
      }
    } catch (err) {
      setAlert(true)
      setAlertContent('Something Went Wrong!')
    }
  }, [])

  return (
    <div style={{ backgroundImage: 'url("bg1.jpeg")', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Paper>
        <Grid container p='1%'>
          <Grid item xs={2} />

          <Grid item xs={2}>
            <FormControl style={{ width: '80%' }}>
              <InputLabel id='input-location-label'>Location</InputLabel>
              <Select
                labelId='input-location-label'
                id='input-location'
                value={values.location}
                label='Location'
                onChange={handleChange('location')}
              >
                <MenuItem value='huahin'>Huahin</MenuItem>
                <MenuItem value='pattaya'>Pattaya</MenuItem>
                <MenuItem value='bangkok'>Bangkok</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <LocalizationProvider dateAdapter={AdapterDayJS}>
              <DateRangePicker
                startText='Check-In'
                endText='Check-Out'
                value={values.inout}
                onChange={handleDateChange('inout')}
                renderInput={(startProps, endProps) => (
                  <>
                    <TextField {...startProps} style={{ width: '40%' }} />
                    <Box sx={{ mx: 3 }}> to </Box>
                    <TextField {...endProps} style={{ width: '40%' }} />
                  </>
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={2}>
            <FormControl variant='outlined'>
              <InputLabel htmlFor='input-number'>Number of Room</InputLabel>
              <OutlinedInput
                id='input-number'
                type='number'
                value={values.number}
                onChange={handleChange('number')}
                label='Number of Room'
              />
            </FormControl>
          </Grid>

          <Grid item xs={2} />
        </Grid>
      </Paper>
      <br />
      <Grid container>
        <Grid item xs={1} />
        <Grid item xs={7} style={{ height: '80vh' }}>
          <PerfectScrollbar>
            <Stack>
              {loading
                ? (
                  <>
                    <SkeletonHotelContainer />
                    <SkeletonHotelContainer />
                  </>
                  )

                : mockHotel.map((hotel, index) => {
                  return (
                    <HotalContainer
                      name={hotel.name}
                      location={hotel.location}
                      detail={hotel.detail}
                      price={hotel.price}
                      key={index}
                    />
                  )
                })}
            </Stack>
          </PerfectScrollbar>
        </Grid>
        <Grid item xs={4} />
      </Grid>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={alert} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
          {alertContent}
        </Alert>
      </Snackbar>
    </div>
  )
}
