import { useState, useEffect } from 'react'
import { Grid, Snackbar, Alert, Stepper, Step, styled, StepLabel, Paper, Button, Box, Stack, TextField, FormGroup, FormControlLabel, Checkbox, Typography, Backdrop, CircularProgress } from '@mui/material'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import InfoIcon from '@mui/icons-material/Info'
import PaymentIcon from '@mui/icons-material/Payment'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import Header from '../../components/header'
import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { forEach, remove, indexOf } from 'lodash'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import CreditCardInput from 'react-credit-card-input'
import axios from 'axios'

export default function Pages ({ queryString }) {
  const [state, setState] = useState(0)
  const [canNext, setCanNext] = useState(true)
  const [canBack, setCanBack] = useState(false)

  const [check, setCheck] = useState([])
  const [checkedRoom, setCheckedRoom] = useState([])

  const [openBackDrop, setOpenBackDrop] = useState(false)
  const handleBackDropClose = () => {
    setOpenBackDrop(false)
  }

  const [alert, setAlert] = useState(false)
  const [alertContent, setAlertContent] = useState('')
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setAlert(false)
  }

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
      }
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
      }
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor:
        theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderRadius: 1
    }
  }))

  const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
    }),
    ...(ownerState.completed && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)'
    })
  }))

  function ColorlibStepIcon (props) {
    const { active, completed, className } = props

    const icons = {
      1: <InfoIcon />,
      2: <PaymentIcon />,
      3: <DoneAllIcon />
    }

    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    )
  }
  const steps = ['Room Information', 'Payment', 'Complete']

  const handleNextBack = (prop) => async (event) => {
    const timeout = 1.5 * 1000 // 2.0sec
    setOpenBackDrop(true)
    // next + 1, back -1
    let nextState = prop === 'next' ? state + 1 : state - 1
    if (nextState < 0) nextState = 0
    if (nextState > steps.length - 1) nextState = steps.length - 1
    if (state === 0 && nextState === 1 && checkedRoom.length !== queryString.number_of_room) {
      return setTimeout(() => {
        setOpenBackDrop(false)
        setAlert(true)
        setAlertContent('Please Select Room(s)')
      }, timeout)
    }
    // state change
    if (nextState !== state) {
      setTimeout(async () => {
        setOpenBackDrop(false)
        setState(nextState)
        if (nextState === steps.length - 1) { // next to last state
          // save booking
          let response = await axios('/api/booking', {
            method: 'POST',
            data: {
              room_ids: checkedRoom,
              room_type: queryString.room_type,
              check_in: queryString.check_in,
              check_out: queryString.check_out,
              branch: queryString.branch
            }
          })
          response = response.data
          if (!response.is_success) {
            setAlert(true)
            setAlertContent(response.data ? response.data : 'Something Went Wrong!')
          }
          setCanNext(false)
        } else if (nextState < steps.length - 1) { // next to but not last state
          setCanNext(true)
        }
        if (nextState === 0) { // back to first state
          setCanBack(false)
        } else if (nextState > 0) { // back but not first state
          setCanBack(true)
        }
      }, timeout)
    }
  }

  const handleCheckBox = (event) => {
    const allch = check
    const index = indexOf(queryString.room_ids, event.target.name)
    if (checkedRoom.length < queryString.number_of_room || allch[index]) {
      allch[index] = !allch[index]
      setCheck([...allch])
      const allChecked = checkedRoom
      if (allch[index]) {
        allChecked.push(event.target.name)
        setCheckedRoom([...allChecked])
      } else {
        remove(allChecked, (checked) => checked === event.target.name)
        setCheckedRoom([...allChecked])
      }
    }
  }

  useEffect(async () => {
    const rooms = []
    await forEach(queryString.room_ids, () => {
      rooms.push(false)
    })
    setCheck(rooms)
  }, [])

  return (
    <div style={{ backgroundImage: 'url("bg1.jpeg")', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Header />
      <br />
      <Grid container>
        <Grid item xs={2} />
        <Grid item xs={8} style={{ height: '80vh' }}>
          <Paper style={{ padding: '30px', height: '12%' }}>
            <Stepper alternativeLabel activeStep={state} style={{ width: '100%' }} connector={<ColorlibConnector />}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
          <Paper style={{ height: '55%', marginTop: '20px', padding: '50px' }}>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={openBackDrop}
              onClick={handleBackDropClose}
            >
              <CircularProgress color='inherit' />
            </Backdrop>
            {
                state === 0 && (
                  <Grid container style={{ height: '100%' }}>
                    <Grid item xs={7}>
                      <Stack>
                        <TextField label='Branch' variant='outlined' defaultValue={queryString.branch} InputProps={{ readOnly: true }} />
                        <TextField label='Type' variant='outlined' defaultValue={queryString.room_type} InputProps={{ readOnly: true }} style={{ marginTop: '10px' }} />
                        <Typography variant='subtitle1' style={{ marginTop: '20px' }}>Select Room(s) you want &ensp; [ Select {queryString.number_of_room - checkedRoom.length} more room(s) ]</Typography>
                        <PerfectScrollbar style={{ marginTop: '10px', height: '240px' }}>
                          <FormGroup>
                            <Grid container>
                              {
                                    queryString.room_ids.map((room, index) => {
                                      return (
                                        <Grid item xs={4} key={index}>
                                          <FormControlLabel control={<Checkbox name={room} checked={check[index]} disabled={checkedRoom.length === queryString.number_of_room && !check[index]} onChange={handleCheckBox} />} label={room} />
                                        </Grid>
                                      )
                                    })
                            }
                            </Grid>
                          </FormGroup>
                        </PerfectScrollbar>
                      </Stack>
                    </Grid>
                    <Grid item xs={5} style={{ height: '100%' }}>
                      <TextField
                        label='Tell us what you need more'
                        multiline
                        rows={10}
                        style={{ width: '95%', marginLeft: '30px' }}
                      />
                    </Grid>
                  </Grid>
                )
            }
            {
                state === 1 && (
                  <Grid container style={{ height: '100%' }}>
                    <Grid xs={3} />
                    <Grid xs={6}>
                      <center>
                        <Paper elevation={3} style={{ height: '10%', paddingTop: '20px', paddingBottom: '20px', paddingLeft: '10px', paddingRight: '10px', width: '80%' }}>
                          <CreditCardInput
                            fieldClassName='input'
                          />
                        </Paper>
                        <Paper elevation={3} style={{ height: '10%', width: '90%', marginTop: '20px', padding: '30px' }}>
                          <Stack>
                            <center>
                              <div>
                                <TextField label='Firstname' variant='outlined' style={{ marginRight: '10px', width: '44%' }} />
                                <TextField label='Lastname' variant='outlined' style={{ width: '44%' }} />
                              </div>
                              <TextField label='Billing Address' variant='outlined' style={{ margin: '10px', width: '90%' }} />
                              <TextField label='Billing Address2' variant='outlined' style={{ width: '90%' }} />
                              <div style={{ marginTop: '10px' }}>
                                <TextField label='City' variant='outlined' style={{ marginRight: '10px', width: '30%' }} />
                                <TextField label='Country' variant='outlined' style={{ marginRight: '10px', width: '30%' }} />
                                <TextField label='Zipcode' variant='outlined' style={{ width: '25%' }} />
                              </div>
                            </center>
                          </Stack>
                        </Paper>
                      </center>
                    </Grid>
                    <Grid xs={3} />
                  </Grid>
                )
            }
            {
                state === 2 && (
                  <Grid container style={{ height: '100%' }}>
                    <Typography>
                      Complete
                    </Typography>
                  </Grid>
                )
            }
          </Paper>
          {
                state !== 2 && (
                  <Paper style={{ width: '100%', height: '8.5%', marginTop: '10px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                      <Button
                        sx={{ ml: 3 }}
                        disabled={!canBack}
                        onClick={handleNextBack('back')}
                        startIcon={<ArrowBackIosNewIcon />}
                      >
                        Back
                      </Button>
                      <Box sx={{ flex: '1 1 auto' }} />
                      <Button
                        sx={{ mr: 3 }}
                        disabled={!canNext}
                        onClick={handleNextBack('next')}
                        endIcon={<NavigateNextIcon />}
                      >
                        {state === 1 ? 'Pay' : 'Next'}
                      </Button>
                    </Box>
                  </Paper>
                )
            }

        </Grid>
        <Grid item xs={2} />
      </Grid>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={alert} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
          {alertContent}
        </Alert>
      </Snackbar>
    </div>
  )
}

Pages.getInitialProps = async ({ query }) => {
  const queryString = {
    branch: query.branch,
    room_type: query.room_type,
    room_ids: query.room_ids.split(','),
    number_of_room: parseInt(query.number_of_room, 10),
    check_in: query.check_in,
    check_out: query.check_out
  }
  return {
    queryString
  }
}
