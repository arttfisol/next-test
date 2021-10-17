import { Paper, Grid, Typography, IconButton } from '@mui/material'

export default function BookingContainer ({ branchName, roomNumber, typeName, checkIn, checkOut, price }) {
  const now = new Date()
  const changeDate = (date) => {
    const offset = now.getTimezoneOffset() * 60000
    return new Date(date.getTime() - offset).toISOString()
  }

  return (
    <IconButton disableRipple>
      <Paper elevation={6} style={{ margin: '1%' }}>
        <Grid container>
          <Grid item xs={3} style={{ padding: '1%', aspectRatio: '1/1', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
            <img src='bg1.jpeg' style={{ objectFit: 'cover', width: '90%', height: '90%', borderRadius: '10%' }} />
          </Grid>
          <Grid item xs={9} style={{ padding: '1%', position: 'relative' }}>
            {
                changeDate(new Date()).split('T')[0] > checkOut
                  ? (
                    <Typography color='orangered' variant='h6' gutterBottom style={{ position: 'absolute', top: '3%', right: '2.5%' }}>Done</Typography>
                    )
                  : (
                    <Typography color='limegreen' variant='h6' gutterBottom style={{ position: 'absolute', top: '3%', right: '2.5%' }}>Booked</Typography>
                    )
            }

            <Typography variant='h6' gutterBottom style={{ marginTop: '2%', marginBottom: '1%', textAlign: 'left' }}>
              Branch : {branchName}
            </Typography>
            <Typography variant='h6' gutterBottom style={{ marginTop: '1%', marginBottom: '1%', textAlign: 'left' }}>
              Room Number : {roomNumber}
            </Typography>
            <Typography variant='h6' gutterBottom style={{ marginTop: '1%', marginBottom: '1%', textAlign: 'left' }}>
              Type : {typeName}
            </Typography>
            <Typography variant='h6' gutterBottom style={{ marginTop: '1%', marginBottom: '1%', textAlign: 'left' }}>
              Check-in : {checkIn}  Check-out : {checkOut}
            </Typography>
            <Typography variant='h6' gutterBottom style={{ position: 'absolute', bottom: '2.5%', right: '2.5%' }}>
              Price ${price}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </IconButton>
  )
}
