import { useState, useEffect } from 'react'
import { Grid, Stack, Select, FormControl, InputLabel, MenuItem, TextField, OutlinedInput, Box, Paper, Snackbar, Alert, Button } from '@mui/material'
import { LocalizationProvider, DateRangePicker } from '@mui/lab'
import axios from 'axios'
import AdapterDayJS from '@mui/lab/AdapterDayJS'
import HotalContainer from '../../components/hotelContainer'
import SkeletonHotelContainer from '../../components/skeleton/hotelContainer'
import Header from '../../components/header'
import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { forEach } from 'lodash'

const now = new Date()

export default function Pages () {
  const [loading, setLoading] = useState(false)
  const [rooms, setRooms] = useState([])
  const [branch, setBranch] = useState([])
  const [values, setValues] = useState({
    branch: '',
    inout: [new Date().toISOString(), new Date(now.setDate(now.getDate() + 1)).toISOString()],
    // inout: ['2021-09-30T123', '2021-10-01T123'],
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

  const submitFilter = async () => {
    try {
      setLoading(true)
      let resRooms = await axios('/api/check-rooms', {
        method: 'GET',
        params: {
          branch: values.branch,
          check_in: values.inout[0].split('T')[0],
          check_out: values.inout[1].split('T')[0],
          number_of_room: values.number
        }
      })
      resRooms = resRooms.data
      if (resRooms.is_success) {
        const r = []
        await forEach(resRooms.data, element => {
          r.push(element)
        })
        setRooms([...r])
        const timeout = 2.5 * 1000 // 2.5sec
        setTimeout(() => {
          setLoading(false)
        }, timeout)
      } else {
        setAlert(true)
        setAlertContent(resRooms.data ? resRooms.data : 'Something Went Wrong!')
      }
    } catch (err) {
      setAlert(true)
      setAlertContent('Something Went Wrong!')
    }
  }

  useEffect(async () => {
    try {
      setLoading(true)
      if (!branch.length) {
        let resBranch = await axios('/api/branch')
        resBranch = resBranch.data
        if (resBranch.is_success) {
          await forEach(resBranch.data, element => {
            setBranch(previousRooms => [...previousRooms, element])
          })
          const selectedBranch = resBranch.data.length ? resBranch.data[0].name : ''
          console.log('first selectedBranch', selectedBranch)
          setValues({ ...values, branch: selectedBranch })
          if (!rooms.length && selectedBranch) {
            let resRooms = await axios('/api/check-rooms', {
              method: 'GET',
              params: {
                branch: selectedBranch,
                check_in: values.inout[0].split('T')[0],
                check_out: values.inout[1].split('T')[0],
                number_of_room: values.number
              }
            })
            resRooms = resRooms.data
            if (resRooms.is_success) {
              await forEach(resRooms.data, element => {
                setRooms(previousRooms => [...previousRooms, element])
              })
              const timeout = 2.5 * 1000 // 2.5sec
              setTimeout(() => {
                setLoading(false)
              }, timeout)
            } else {
              setAlert(true)
              setAlertContent(resRooms.data ? resRooms.data : 'Something Went Wrong!')
            }
          }
        } else {
          setAlert(true)
          setAlertContent(resBranch.data ? resBranch.data : 'Something Went Wrong!')
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

                : rooms.map((room, index) => {
                  return (
                    <HotalContainer
                      type={room.room_type}
                      detail='{-------------------------------------------------------------------------------------------------------This is for detail of each room---------------------------------------------------------------------------------------------}'
                      price={numberWithCommas(room.room_price)}
                      key={index}
                    />
                  )
                })}
            </Stack>
          </PerfectScrollbar>
        </Grid>
        <Grid item xs={4}>
          <Paper style={{ margin: '60px' }}>
            <Stack>
              <FormControl style={{ margin: '50px', width: '80%' }}>
                <InputLabel id='input-location-label'>Branch</InputLabel>
                <Select
                  labelId='input-location-label'
                  id='input-location'
                  value={values.branch}
                  label='Location'
                  onChange={handleChange('branch')}
                >
                  {
                    branch.map((branch, index) => {
                      return (
                        <MenuItem value={branch.name} key={index}>{branch.name}</MenuItem>
                      )
                    })
                  }
                </Select>
              </FormControl>
              <div style={{ marginLeft: '40px', marginRight: '40px', marginBottom: '40px' }}>
                <LocalizationProvider dateAdapter={AdapterDayJS}>
                  <DateRangePicker
                    style={{ width: '100%' }}
                    startText='Check-In'
                    endText='Check-Out'
                    value={values.inout}
                    onChange={handleDateChange('inout')}
                    renderInput={(startProps, endProps) => (
                      <>
                        <TextField {...startProps} style={{ width: '50%' }} />
                        <Box sx={{ mx: 3 }}> to </Box>
                        <TextField {...endProps} style={{ width: '50%' }} />
                      </>
                    )}
                  />
                </LocalizationProvider>
              </div>
              <FormControl variant='outlined' style={{ marginLeft: '125px', marginRight: '125px', marginBottom: '40px', width: '50%' }}>
                <InputLabel htmlFor='input-number'>Number of Room</InputLabel>
                <OutlinedInput
                  id='input-number'
                  type='number'
                  value={values.number}
                  onChange={handleChange('number')}
                  label='Number of Room'
                />
              </FormControl>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                size='large'
                onClick={submitFilter}
              >
                Submit
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={alert} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
          {alertContent}
        </Alert>
      </Snackbar>
    </div>
  )
}
