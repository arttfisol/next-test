import { useState, useEffect } from 'react'
import { Grid } from '@mui/material'
import axios from 'axios'
import { forEach } from 'lodash'
import Menu from '../../../components/menu'
export default function ButtonAppBar () {
  const [rooms, setRooms] = useState([])

  useEffect(async () => {
    const resRooms = await axios('/api/rooms')
    if (!rooms.length) {
      await forEach(resRooms.data, element => {
        setRooms(previousRooms => [...previousRooms, element])
      })
    }
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '10%' }} />
      <Grid container style={{ width: '100%', height: '100%' }}>
        <Menu />
        <Grid item xs={1} />
        <Grid item xs={8} />
      </Grid>
    </div>
  )
}
