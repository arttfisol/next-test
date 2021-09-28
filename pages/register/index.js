
import { useState } from 'react'
import { Stack, Button, Paper, InputLabel, OutlinedInput, FormControl, InputAdornment, IconButton, Typography, Link, TextField } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { DatePicker, LocalizationProvider } from '@mui/lab'
import AdapterDayJS from '@mui/lab/AdapterDayJS'

export default function Pages () {
  const [values, setValues] = useState({
    email: '',
    username: '',
    firstname: '',
    lastname: '',
    password: '',
    cpassowrd: '',
    birthdate: '',
    showPassword: false,
    showCPassword: false
  })

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

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword
    })
  }
  const handleClickShowCPassword = () => {
    setValues({
      ...values,
      showCPassword: !values.showCPassword
    })
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }
  const handleMouseDownCPassword = (event) => {
    event.preventDefault()
  }

  const submitForm = () => {}
  return (
    <div style={{ backgroundImage: 'url("bg1.jpeg")', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={16} style={{ padding: '2.2% 5%', width: '17%', height: '87%', marginTop: '1%' }}>
        <Stack
          component='form'
          spacing={2}
          noValidate
          autoComplete='off'
          onSubmit={submitForm}
        >
          <center>
            <img src='mv.png' style={{ paddingBottom: '10px' }} />
            <Typography variant='h5' gutterBottom>
              Register
            </Typography>
          </center>

          <FormControl variant='outlined'>
            <InputLabel htmlFor='input-firstname'>First Name</InputLabel>
            <OutlinedInput
              id='input-firstname'
              type='text'
              value={values.firstname}
              onChange={handleChange('firstname')}
              label='First Name'
            />
          </FormControl>

          <FormControl variant='outlined'>
            <InputLabel htmlFor='input-lastname'>Last Name</InputLabel>
            <OutlinedInput
              id='input-lastname'
              type='text'
              value={values.lastname}
              onChange={handleChange('lastname')}
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
              value={values.birthdate}
              onChange={handleDateChange('birthdate')}
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
              type={values.showPassword ? 'text' : 'password'}
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
              type={values.showCPassword ? 'text' : 'password'}
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
    </div>
  )
}
