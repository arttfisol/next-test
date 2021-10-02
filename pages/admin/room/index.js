import { useState, useEffect } from 'react'
import { Grid, Button, Typography, Box, Modal, FormControl, Stack, InputLabel, OutlinedInput, Snackbar, Alert, Select, MenuItem } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Menu from '../../../components/menu'
import axios from 'axios'
import { forEach, find } from 'lodash'
import RoomContainer from '../../../components/roomContainer'

export default function ButtonAppBar () {
  const [rooms, setRooms] = useState([])
  const [seletedRooms, setSeletedRooms] = useState([])
  const [roomTypes, setRoomTypes] = useState([])
  const [branch, setBranch] = useState([])
  const [addRoom, setAddRoom] = useState({
    room_number: '',
    room_type: '',
    room_price: 0,
    branch: ''
  })

  const handleAddChange = (prop) => async (event) => {
    if (prop === 'room_type') {
      const selectedType = find(roomTypes, { type: event.target.value })
      setAddRoom({ ...addRoom, [prop]: event.target.value, room_price: selectedType.price })
    } else {
      setAddRoom({ ...addRoom, [prop]: event.target.value })
    }
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
  useEffect(async ()=>{
    const sRoom = []
    await forEach(rooms, element => {
      element.branch === addRoom.branch && sRoom.push(element)
    })
    setSeletedRooms([...sRoom])
  },[addRoom.branch,rooms])

  useEffect(async () => {
    if (!roomTypes.length) {
      let resRoomTypes = await axios('/api/room-types')
      resRoomTypes = resRoomTypes.data
      if (resRoomTypes.is_success) {
        await forEach(resRoomTypes.data, element => {
          setRoomTypes(previousRooms => [...previousRooms, element])
        })
      }
    }
    if (!branch.length) {
      let resBranch = await axios('/api/branch')
      resBranch = resBranch.data
      if (resBranch.is_success) {
        await forEach(resBranch.data, element => {
          setBranch(previousRooms => [...previousRooms, element])
        })
        const selectedBranch = resBranch.data.length ? resBranch.data[0].name : ''
        setAddRoom({...addRoom,branch: selectedBranch})
        if (!rooms.length && selectedBranch) {
          let resRooms = await axios('/api/rooms')
          resRooms = resRooms.data
          if (resRooms.is_success) {
            await forEach(resRooms.data, element => {
                setRooms(previousRooms => [...previousRooms, element])
                console.log('element', element)
                console.log('selectedBranch', selectedBranch)
                if(element.branch === selectedBranch){
                  setSeletedRooms(previousRooms => [...previousRooms, element])
                }
            })
          }
        }
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
          room_price: addRoom.room_price,
          branch: addRoom.branch
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
      handleCloseAdd()
      setAddRoom({
        ...addRoom,
        room_number: '',
        room_type: '',
        room_price: 0,
      })
    } catch (err) {
      setAlert(true)
      setAlertContent('Something Went Wrong!')
    }
  }

  const numberWithCommas = (num) => {
    return num.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
                    <InputLabel id='input-add-room_type-label'>Room Type</InputLabel>
                    <Select
                      labelId='input-add-room_type-label'
                      id='input-add-room_type'
                      value={addRoom.room_type}
                      label='Room Type'
                      onChange={handleAddChange('room_type')}
                    >
                      {
                        roomTypes.map((type, index) => {
                          return (
                            <MenuItem value={type.type} key={index}>{type.type}</MenuItem>
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
                      value={addRoom.room_price}
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
            <FormControl style={{width:'210px'}}>
              <InputLabel id='input-branch-label'>Branch</InputLabel>
              <Select
                labelId='input-branch-label'
                id='input-branch'
                value={addRoom.branch}
                label='Branch'
                onChange={handleAddChange('branch')}
              >
                {
                  branch.map((branch, index) => {
                    return (
                      <MenuItem value={branch.name} key={index}>{branch.name}</MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
          </div>
          <PerfectScrollbar style={{ height: '75vh', width: '100%' }}>
            <Grid container>
              {
                seletedRooms.map((seletedRoom, index) => {
                  return (
                    <Grid item xs={3} key={index}>
                      <RoomContainer
                        number={seletedRoom.room_number}
                        type={seletedRoom.room_type}
                        price={numberWithCommas(seletedRoom.room_price)}
                        branch={seletedRoom.branch}
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
