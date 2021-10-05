import { Paper, Grid, Typography, IconButton, Backdrop, CircularProgress } from '@mui/material'
import Router from 'next/router'
import { useState } from 'react'

export default function HotelContainer ({ branch, type, detail, price, number, ids, checkIn, checkOut }) {
  const [openBackDrop, setOpenBackDrop] = useState(false)
  const handleBackDropClose = () => {
    setOpenBackDrop(false)
  }

  const handleClick = () => {
    const timeout = 1.5 * 1000 // 2.0sec
    setOpenBackDrop(true)
    setTimeout(() => {
      setOpenBackDrop(false)
      Router.push({
        pathname: '/process',
        query: {
          branch: branch,
          room_type: type,
          room_ids: ids,
          number_of_room: number.toString(),
          check_in: checkIn,
          check_out: checkOut
        }
      })
    }, timeout)
  }
  return (
    <IconButton disableRipple onClick={handleClick}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackDrop}
        onClick={handleBackDropClose}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      <Paper elevation={6} style={{ margin: '1%' }}>
        <Grid container>
          <Grid item xs={4} style={{ padding: '1%', aspectRatio: '1/1', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
            <img src='pic_test.jpg' style={{ objectFit: 'cover', width: '90%', height: '90%', borderRadius: '10%' }} />
          </Grid>
          <Grid item xs={8} style={{ padding: '1%', position: 'relative' }}>
            <Typography variant='h5' gutterBottom style={{ marginTop: '1%', marginBottom: '1%' }}>
              TYPE: {type}
            </Typography>
            <Typography variant='h6' gutterBottom style={{ marginTop: '1%', marginBottom: '1%' }}>
              {detail}
            </Typography>
            <Typography variant='h6' gutterBottom style={{ position: 'absolute', bottom: '2.5%', right: '2.5%' }}>
              Price ${price}/night
            </Typography>

          </Grid>
        </Grid>
      </Paper>
    </IconButton>
  )
}
