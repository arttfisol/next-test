
import { useState } from 'react'
import { Stack, Button, Paper, InputLabel, OutlinedInput, FormControl, InputAdornment, IconButton, Typography, Link, TextField, Alert, Snackbar } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { DatePicker, LocalizationProvider } from '@mui/lab'
import AdapterDayJS from '@mui/lab/AdapterDayJS'
import Router from 'next/router'
import axios from 'axios'

export default function Pages () {
  const [values, setValues] = useState({
    email: '',
    username: '',
    fname: '',
    lname: '',
    tel: '',
    password: '',
    cpassword: '',
    birth: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showCPassword, setShowCPassword] = useState(false)

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
      setValues({
        ...values, [prop]: event.toISOString()
      })
    } catch (err) {}
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }
  const handleMouseDownCPassword = (event) => {
    event.preventDefault()
  }
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const handleClickShowCPassword = () => {
    setShowCPassword(!showCPassword)
  }

  const submitForm = async () => {
    // check empty
    console.log('values ', values)
    for (const prop in values) {
      if (values[prop] === '') {
        setAlert(true)
        setAlertContent('Must Fill All Fields')
        return
      }
    }

    // check password and cpassword
    if (values.password !== values.cpassword) {
      setAlert(true)
      setAlertContent('Password Not Equal to Confirm Password')
      return
    }

    const response = await axios('/api/register', {
      method: 'POST',
      data: {
        fname: values.firstname,
        lname: values.lastname,
        tel: values.telephone,
        birth: new Date(values.birthdate),
        email: values.email,
        password: values.password,
        cpassword: values.cpassowrd
      }
    })
    if (response.is_success) {
      Router.push('/login')
    } else {
      setAlert(true)
      setAlertContent('Register Fail')
    }
  }

  return (
    <div style={{ backgroundImage: 'url("bg1.jpeg")', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={16} style={{ padding: '2.2% 5%', width: '17%', height: '87%', marginTop: '1%' }}>
        <Stack
          spacing={2}
          noValidate
          autoComplete='off'
        >
          <center>
            <img src='mv.png' style={{ paddingBottom: '10px' }} />
            <Typography variant='h5' gutterBottom>
              Register
            </Typography>
          </center>

          <FormControl variant='outlined'>
            <InputLabel htmlFor='input-fname'>First Name</InputLabel>
            <OutlinedInput
              id='input-fname'
              type='text'
              value={values.fname}
              onChange={handleChange('fname')}
              label='First Name'
            />
          </FormControl>

          <FormControl variant='outlined'>
            <InputLabel htmlFor='input-lname'>Last Name</InputLabel>
            <OutlinedInput
              id='input-lname'
              type='text'
              value={values.lname}
              onChange={handleChange('lname')}
              label='Last Name'
            />
          </FormControl>

          <FormControl variant='outlined'>
            <InputLabel htmlFor='input-tel'>Telephone</InputLabel>
            <OutlinedInput
              id='input-tel'
              type='text'
              value={values.tel}
              onChange={handleChange('tel')}
              label='Telephone'
            />
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayJS}>
            <DatePicker
              disableFuture
              label='Birthdate'
              value={values.birth}
              onChange={handleDateChange('birth')}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <FormControl variant='outlined'>
            <InputLabel htmlFor='input-lastname'>Username</InputLabel>
            <OutlinedInput
              id='input-username'
              type='text'
              value={values.username}
              onChange={handleChange('username')}
              label='Username'
            />
          </FormControl>

          <FormControl variant='outlined'>
            <InputLabel htmlFor='input-email'>Email</InputLabel>
            <OutlinedInput
              id='input-email'
              type='email'
              value={values.email}
              onChange={handleChange('email')}
              label='Email'
            />
          </FormControl>

          <FormControl variant='outlined'>
            <InputLabel htmlFor='input-password'>Password</InputLabel>
            <OutlinedInput
              id='input-password'
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange('password')}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge='end'
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
            }
              label='Password'
            />
          </FormControl>

          <FormControl variant='outlined'>
            <InputLabel htmlFor='input-cpassword'>Confirm Password</InputLabel>
            <OutlinedInput
              id='input-cpassword'
              type={showCPassword ? 'text' : 'password'}
              value={values.cpassword}
              onChange={handleChange('cpassword')}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle cpassword visibility'
                    onClick={handleClickShowCPassword}
                    onMouseDown={handleMouseDownCPassword}
                    edge='end'
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
            }
              label='CPassword'
            />
          </FormControl>

          <Button
            type='submit'
            variant='contained'
            color='error'
            size='large'
            onClick={submitForm}
          >
            Submit
          </Button>
          <center>
            <Typography variant='body' gutterBottom>
              Have an account?&nbsp;
              <Link href='/login' color='error'>
                Login Here
              </Link>
            </Typography>
          </center>
        </Stack>
      </Paper>
      <Snackbar open={alert} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
          {alertContent}
        </Alert>
      </Snackbar>
    </div>
  )
}
