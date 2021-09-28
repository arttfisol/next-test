import { Paper, Card, Typography, CardMedia, CardContent } from '@mui/material'

export default function RoomContainer ({ number, type, price }) {
  return (
    <Paper elevation={6} style={{ margin: '2%' }}>
      <Card>
        <CardMedia
          component='img'
          height='140'
          image='/bg1.jpeg'
          alt=''
        />
        <CardContent>
          <Typography gutterBottom variant='h6' component='div'>
            Room Number: {number}
          </Typography>
          <Typography gutterBottom variant='h6' component='div'>
            Room Type: {type}
          </Typography>
          <Typography gutterBottom variant='h6' component='div'>
            Room Price: {price}
          </Typography>
        </CardContent>
      </Card>
    </Paper>
  )
}
