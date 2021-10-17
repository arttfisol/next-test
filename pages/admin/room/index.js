import { useState, useEffect } from 'react'
import { Grid, Button, Typography, Box, Modal, FormControl, Stack, InputLabel, OutlinedInput, Snackbar, Alert, Select, MenuItem } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Menu from '../../../components/menu'
import axios from 'axios'
import { forEach, find, isEmpty } from 'lodash'
import RoomContainer from '../../../components/roomContainer'

export default function ButtonAppBar () {
  const [rooms, setRooms] = useState([])
  const [seletedRooms, setSeletedRooms] = useState([])
  const [roomTypes, setRoomTypes] = useState([])
  const [branch, setBranch] = useState([])
  const [addRoom, setAddRoom] = useState({
    room_number: '',
    room_type_id: 0,
    room_type: '',
    room_price: 0,
    branch_name: '',
    branch_id: 0
  })

  const handleAddChange = (prop) => async (event) => {
    console.log('event.target.value: ', event.target.value)
    console.log('find(branch, { branch_name: event.target.value }): ', find(branch, { branch_name: event.target.value }))
    if (prop === 'room_type') {
      const selectedType = find(roomTypes, { type_name: event.target.value })
      setAddRoom({ ...addRoom, [prop]: event.target.value, room_price: selectedType.price, room_type_id: selectedType.type_id })
    } else if (prop === 'branch_name') {
      const selectedBranch = find(branch, { branch_name: event.target.value })
      console.log('selectedBranch: ', selectedBranch)
      setAddRoom({ ...addRoom, [prop]: event.target.value, branch_id: selectedBranch.branch_id })
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
  useEffect(async () => {
    const sRoom = []
    await forEach(rooms, element => {
      element.branch_id === addRoom.branch_id && sRoom.push(element)
    })
    setSeletedRooms([...sRoom])
  }, [addRoom.branch_name, rooms])

  useEffect(async () => {
    try {
      if (!roomTypes.length) {
        let resRoomTypes = await axios('/api/room-types')
        resRoomTypes = resRoomTypes.data
        if (resRoomTypes.is_success) {
          await forEach(resRoomTypes.data, element => {
            setRoomTypes(previousTypes => [...previousTypes, element])
          })
        } else {
          setAlert(true)
          setAlertContent(resRoomTypes.data ? resRoomTypes.data : 'Something Went Wrong!')
        }
      }

      if (!branch.length) {
        let resBranch = await axios('/api/branch')
        resBranch = resBranch.data
        if (resBranch.is_success) {
          await forEach(resBranch.data, element => {
            setBranch(previousRooms => [...previousRooms, element])
          })
          const selectedBranch = resBranch.data.length ? resBranch.data[0] : {}
          setAddRoom({ ...addRoom, branch_name: selectedBranch.branch_name, branch_id: selectedBranch.branch_id })
          if (!rooms.length && !isEmpty(selectedBranch)) {
            let resRooms = await axios('/api/rooms')
            resRooms = resRooms.data
            if (resRooms.is_success) {
              await forEach(resRooms.data, element => {
                setRooms(previousRooms => [...previousRooms, element])
                if (element.branch_id === selectedBranch.branch_id) {
                  console.log('element: ', element)
                  setSeletedRooms(previousRooms => [...previousRooms, element])
                }
              })
            } else {
              setAlert(true)
              setAlertContent(resRooms.data ? resRooms.data : 'Something Went Wrong!')
            }
          }
        } else {
          setAlert(true)
          setAlertContent(resBranch.data ? resBranch.data : 'Something Went Wrong!')
        }
      }
    } catch (err) {
      setAlert(true)
      setAlertContent('Something Went Wrong!')
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
      if (addRoom.room_number === '' || addRoom.room_type_id === 0 || addRoom.branch_id === '') {
        setAlert(true)
        setAlertContent('Must Fill All Fields')
        return
      }
      let response = await axios('/api/room', {
        method: 'POST',
        data: {
          room_number: addRoom.room_number,
          type_id: addRoom.room_type_id,
          branch_id: addRoom.branch_id
        }
      })
      response = response.data
      if (response.is_success) {
        const r = []
        await forEach(response.data, element => {
          console.log('res: ', element)
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
        room_type_id: 0,
        room_type: '',
        room_price: 0
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
                      value={addRoom.room_type.type_name}
                      label='Room Type'
                      onChange={handleAddChange('room_type')}
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
            <FormControl style={{ width: '210px' }}>
              <InputLabel id='input-branch-label'>Branch</InputLabel>
              <Select
                labelId='input-branch-label'
                id='input-branch'
                value={addRoom.branch_name}
                label='Branch'
                onChange={handleAddChange('branch_name')}
              >
                {
                  branch.map((branch, index) => {
                    return (
                      <MenuItem value={branch.branch_name} key={index}>{branch.branch_name}</MenuItem>
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
                        RoomNumber={seletedRoom.room_number}
                        typeName={seletedRoom.type_name}
                        typeId={seletedRoom.type_id}
                        price={numberWithCommas(seletedRoom.price)}
                        branchId={seletedRoom.branch_id}
                        branchName={seletedRoom.branch_name}
                        setRooms={setRooms}
                        roomTypes={roomTypes}
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
