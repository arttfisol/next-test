import { useState, useEffect } from 'react'
import { Grid, Button, Typography, Box, Modal, FormControl, Stack, InputLabel, OutlinedInput, Snackbar, Alert } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Menu from '../../../components/menu'
import axios from 'axios'
import { forEach } from 'lodash'
import RoomContainer from '../../../components/roomContainer'

export default function ButtonAppBar () {
  const [rooms, setRooms] = useState([])
  const [addRoom, setAddRoom] = useState({
    room_number: '',
    room_type: '',
    room_price: 0
  })

  const handleAddChange = (prop) => (event) => {
    setAddRoom({ ...addRoom, [prop]: event.target.value })
  }
  const [openAdd, setOpenAdd] = useState(false)
  const handleOpenAdd = () => setOpenAdd(true)
  const handleCloseAdd = () => setOpenAdd(false)

  const [alert, setAlert] = useState(false)
  const [alertContent, setAlertContent] = useState('')
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setAlert(false)
  }

  useEffect(async () => {
    if (!rooms.length) {
      let resRooms = await axios('/api/rooms')
      resRooms = resRooms.data
      if (resRooms.is_success) {
        await forEach(resRooms.data, element => {
          setRooms(previousRooms => [...previousRooms, element])
        })
      }
    }
  }, [])

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  }

  const submitAddForm = async () => {
    try {
      if (addRoom.room_number === '' || addRoom.room_type === '' || addRoom.room_price === 0) {
        setAlert(true)
        setAlertContent('Must Fill All Fields')
        return
      }
      let response = await axios('/api/room', {
        method: 'POST',
        data: {
          room_number: addRoom.room_number,
          room_type: addRoom.room_type,
          room_price: addRoom.room_price
        }
      })
      response = response.data
      if (response.is_success) {
        setRooms([])
        await forEach(response.data, element => {
          setRooms(previousRooms => [...previousRooms, element])
        })
      } else {
        setAlert(true)
        setAlertContent(response.data ? response.data : 'Something Went Wrong!')
      }
      handleCloseAdd()
    } catch (err) {
      setAlert(true)
      setAlertContent('Something Went Wrong!')
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '10%' }} />
      <Grid container style={{ width: '100%', height: '100%' }}>
        <Menu />
        <Grid item xs={1} />
        <Grid item xs={8}>
          <div style={{ width: '100%', height: '10%' }}>
            <Button variant='outlined' onClick={handleOpenAdd} startIcon={<AddIcon />} style={{ margin: '1%' }}>
              Add Room
            </Button>
            <Modal
              open={openAdd}
              onClose={handleCloseAdd}
              aria-labelledby='modal-modal-title'
              aria-describedby='modal-modal-description'
            >
              <Box sx={style}>
                <Stack
                  spacing={2}
                  noValidate
                  autoComplete='off'
                >
                  <center>
                    <Typography variant='h5' gutterBottom>
                      Add Room
                    </Typography>
                  </center>
                  <FormControl variant='outlined'>
                    <InputLabel htmlFor='input-add-room_number'>Room Number</InputLabel>
                    <OutlinedInput
                      id='input-add-room_number'
                      type='text'
                      value={addRoom.room_number}
                      onChange={handleAddChange('room_number')}
                      label='Room Number'
                    />
                  </FormControl>

                  <FormControl variant='outlined'>
                    <InputLabel htmlFor='input-add-room_type'>Room Type</InputLabel>
                    <OutlinedInput
                      id='input-add-room_type'
                      type='text'
                      value={addRoom.room_type}
                      onChange={handleAddChange('room_type')}
                      label='Room Type'
                    />
                  </FormControl>

                  <FormControl variant='outlined'>
                    <InputLabel htmlFor='input-add-room_price'>Room Price</InputLabel>
                    <OutlinedInput
                      id='input-add-room_price'
                      type='number'
                      value={addRoom.room_price}
                      onChange={handleAddChange('room_price')}
                      label='Room Price'
                    />
                  </FormControl>

                  <Button
                    type='submit'
                    variant='contained'
                    size='large'
                    onClick={submitAddForm}
                  >
                    Add
                  </Button>
                </Stack>
              </Box>
            </Modal>
          </div>
          <PerfectScrollbar style={{ height: '75vh', width: '100%' }}>
            <Grid container>
              {
                rooms.map((room, index) => {
                  return (
                    <Grid item xs={3} key={index}>
                      <RoomContainer
                        number={room.room_number}
                        type={room.room_type}
                        price={room.room_price}
                        setRooms={setRooms}
                      />
                    </Grid>
                  )
                })
               }

            </Grid>
          </PerfectScrollbar>
        </Grid>
      </Grid>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={alert} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
          {alertContent}
        </Alert>
      </Snackbar>
    </div>
  )
}
