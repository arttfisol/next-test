import { Paper, Grid, Menu, IconButton, MenuItem } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useState } from 'react'
import Router from 'next/router'
import axios from 'axios'

export default function Header () {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await axios('/api/logout')
    Router.push('/login')
  }

  return (
    <Paper style={{ height: '10vh', textAlign: 'center' }} elevation={6}>
      <Grid container style={{ height: '100%' }}>
        <Grid item xs={1} />
        <Grid item xs={10} style={{ height: '100%', textAlign: 'center' }}>
          <img src='mv.png' style={{ height: '70%', aspectRatio: '2.178', padding: '15px' }} />
        </Grid>
        <Grid item xs={1} style={{ height: '100%' }}>

          {/* <AccountCircleIcon fontSize='large' color='error' style={{ height: '100%' }}>
            <Button style={{ height: '100%' }} onClick={() => { console.log('click') }} />
          </AccountCircleIcon> */}
          <IconButton
            aria-label='toggle password visibility'
            style={{ margin: '20px' }}
            aria-controls='menu'
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <AccountCircleIcon fontSize='large' color='error' style={{ height: '100%' }} />
          </IconButton>
          <Menu
            id='menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Grid>
      </Grid>
    </Paper>
  )
}
