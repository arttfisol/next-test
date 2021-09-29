
import { useState } from 'react'
import { Stack, Button, Paper, InputLabel, OutlinedInput, FormControl, InputAdornment, IconButton, Typography, Link, Alert, Snackbar } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import Router from 'next/router'
import axios from 'axios'

export default function Pages () {
  const [values, setValues] = useState({
    email: '',
    password: '',
    showPassword: false
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
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword
    })
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const submitForm = async () => {
    try {
      if (values.email === '' || values.password === '') {
        setAlert(true)
        setAlertContent('Must Fill All Fields')
        return
      }

      let response = await axios('/api/login', {
        method: 'POST',
        data: {
          email: values.email,
          password: values.password
        }
      })
      response = response.data
      if (response.is_success) {
        if (values.email === 'test@gmail.com') {
          Router.push('/admin/room')
        }
        Router.push('/home')
      } else {
        setAlert(true)
        setAlertContent(response.data ? response.data : 'Something Went Wrong!')
      }
    } catch (err) {
      setAlert(true)
      setAlertContent('Something Went Wrong!')
    }
  }
  return (
    <div style={{ backgroundImage: 'url("bg1.jpeg")', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={16} style={{ padding: '5%', width: '15%', height: '40%', marginTop: '10%' }}>
        <Stack
          spacing={2}
          noValidate
          autoComplete='off'
        >
          <center>
            <img src='mv.png' style={{ paddingBottom: '10px' }} />
            <Typography variant='h5' gutterBottom>
              Login
            </Typography>
          </center>
          <FormControl variant='outlined'>
            <InputLabel htmlFor='input-email'>Email</InputLabel>
            <OutlinedInput
              id='input-email'
              type='text'
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
          <Button
            type='submit'
            variant='contained'
            color='error'
            size='large'
            onClick={submitForm}
          >
            Login
          </Button>
          <center>
            <Typography variant='body' gutterBottom>
              Don't have an account?&nbsp;
              <Link href='/register' color='error'>
                Register Here
              </Link>
            </Typography>
          </center>

        </Stack>
      </Paper>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={alert} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
          {alertContent}
        </Alert>
      </Snackbar>
    </div>
  )
}
