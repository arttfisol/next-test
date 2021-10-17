import { useState } from 'react'
import { Paper, Card, Typography, CardMedia, CardContent, Button, Modal, Box, Snackbar, Alert, Stack, FormControl, InputLabel, OutlinedInput, Select, MenuItem } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import axios from 'axios'
import { forEach, find } from 'lodash'

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

export default function RoomContainer ({ RoomNumber, typeName, typeId, price, branchId, branchName, setRooms, roomTypes }) {
  const [openDel, setOpenDel] = useState(false)
  const handleOpenDel = () => setOpenDel(true)
  const handleCloseDel = () => setOpenDel(false)

  const [openEdit, setOpenEdit] = useState(false)
  const handleOpenEdit = () => setOpenEdit(true)
  const handleCloseEdit = () => setOpenEdit(false)

  const [editValue, setEditValue] = useState({
    room_number: RoomNumber,
    type_id: typeId,
    type_name: typeName,
    price: price
  })

  const handleEditChange = (prop) => (event) => {
    try {
      if (prop === 'type_name') {
        const selectedType = find(roomTypes, { type_name: event.target.value })
        setEditValue({ ...editValue, [prop]: event.target.value, type_id: selectedType.type_id, price: selectedType.price })
      } else {
        setEditValue({
          ...editValue, [prop]: event.target.value
        })
      }
    } catch (err) {}
  }

  const [alert, setAlert] = useState(false)
  const [alertContent, setAlertContent] = useState('')
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setAlert(false)
  }

  const submitEditForm = async () => {
    try {
      let response = await axios('/api/room', {
        method: 'PUT',
        data: {
          old_room_number: RoomNumber,
          room_number: editValue.room_number,
          type_id: editValue.type_id,
          branch_id: branchId
        }
      })
      response = response.data
      if (response.is_success) {
        const r = []
        await forEach(response.data, element => {
          r.push(element)
        })
        setRooms([...r])
      } else {
        setAlert(true)
        setAlertContent(response.data ? response.data : 'Something Went Wrong!')
      }
      handleCloseEdit()
    } catch (err) {
      setAlert(true)
      setAlertContent('Something Went Wrong!')
    }
  }

  const submitDelForm = async () => {
    try {
      let response = await axios('/api/room', {
        method: 'DELETE',
        data: {
          room_number: RoomNumber,
          branch_id: branchId
        }
      })
      response = response.data
      if (response.is_success) {
        const r = []
        await forEach(response.data, element => {
          r.push(element)
        })
        setRooms([...r])
      } else {
        setAlert(true)
        setAlertContent(response.data ? response.data : 'Something Went Wrong!')
      }
      handleCloseDel()
    } catch (err) {
      setAlert(true)
      setAlertContent('Something Went Wrong!')
    }
  }

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
            Room Number: {RoomNumber}
          </Typography>
          <Typography gutterBottom variant='h6' component='div'>
            Room Type: {typeName}
          </Typography>
          <Typography gutterBottom variant='h6' component='div'>
            Room Price: {price}
          </Typography>
          <Button variant='outlined' onClick={handleOpenEdit} color='warning' startIcon={<EditIcon />} style={{ margin: '1%' }}>
            Edit
          </Button>
          <Modal
            open={openEdit}
            onClose={handleOpenEdit}
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
                    Edit Room
                  </Typography>
                </center>
                <FormControl variant='outlined'>
                  <InputLabel htmlFor='input-add-room_number'>Room Number</InputLabel>
                  <OutlinedInput
                    id='input-add-room_number'
                    type='text'
                    value={editValue.room_number}
                    onChange={handleEditChange('room_number')}
                    label='Room Number'
                  />
                </FormControl>

                <FormControl variant='outlined'>
                  <InputLabel id='input-add-room_type-label'>Room Type</InputLabel>
                  <Select
                    labelId='input-add-room_type-label'
                    id='input-add-room_type'
                    value={editValue.type_name}
                    label='Room Type'
                    onChange={handleEditChange('type_name')}
                  >
                    {
                        roomTypes.map((type, index) => {
                          return (
                            <MenuItem value={type.type_name} key={index}>{type.type_name}</MenuItem>
                          )
                        })
                      }
                  </Select>
                </FormControl>

                <FormControl variant='outlined'>
                  <InputLabel htmlFor='input-add-room_price'>Room Price</InputLabel>
                  <OutlinedInput
                    disabled
                    id='input-add-room_price'
                    type='number'
                    value={editValue.price}
                    label='Room Price'
                  />
                </FormControl>

                <div>
                  <center>
                    <Button
                      variant='contained'
                      size='large'
                      onClick={handleCloseEdit}
                      color='primary'
                      style={{ marginRight: '10px' }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant='contained'
                      size='large'
                      onClick={submitEditForm}
                      color='warning'
                    >
                      Edit
                    </Button>
                  </center>
                </div>
              </Stack>
            </Box>
          </Modal>
          <Button variant='outlined' color='error' onClick={handleOpenDel} startIcon={<DeleteIcon />} style={{ margin: '1%' }}>
            Delete
          </Button>
          <Modal
            open={openDel}
            onClose={handleCloseDel}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <Typography id='modal-modal-title' variant='h6'>
                Delete
              </Typography>
              <br />
              <Typography id='modal-modal-title' variant='body'>
                Are you sure to delete room number {RoomNumber} in {branchName} ?
              </Typography>
              <br />
              <br />
              <Button
                variant='contained'
                size='large'
                onClick={handleCloseDel}
                color='primary'
                style={{ marginRight: '10px' }}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                size='large'
                onClick={submitDelForm}
                color='error'
              >
                Delete
              </Button>
            </Box>
          </Modal>
        </CardContent>
      </Card>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={alert} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
          {alertContent}
        </Alert>
      </Snackbar>
    </Paper>
  )
}
