import { useState } from 'react'
import { Paper, Card, Typography, CardMedia, CardContent, Button, Modal, Box, Snackbar, Alert } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import axios from 'axios'
import { forEach } from 'lodash'

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

export default function RoomContainer ({ RoomNumber, type, price, branchId, branchName, setRooms }) {
  const [openDel, setOpenDel] = useState(false)
  const handleOpenDel = () => setOpenDel(true)
  const handleCloseDel = () => setOpenDel(false)

  const [alert, setAlert] = useState(false)
  const [alertContent, setAlertContent] = useState('')
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setAlert(false)
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
            Room Type: {type}
          </Typography>
          <Typography gutterBottom variant='h6' component='div'>
            Room Price: {price}
          </Typography>
          <Button variant='outlined' color='error' onClick={handleOpenDel} startIcon={<DeleteIcon />} style={{ margin: '1%' }}>
            Delete Room
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
