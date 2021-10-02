import { Paper } from '@mui/material'

export default function Header ({ number, type, price }) {
  return (
    <Paper style={{ height: '10vh', textAlign: 'center' }} elevation={6}>

      <img src='mv.png' style={{ height: '70%', aspectRatio: '2.178', padding: '15px' }} />

    </Paper>
  )
}
