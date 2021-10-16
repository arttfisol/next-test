import { useState, useEffect } from 'react'
import { Grid, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import axios from 'axios'
import { forEach } from 'lodash'
import Menu from '../../../components/menu'

export default function ButtonAppBar () {
  const [booking, setBooking] = useState([])
  const [selectedBooking, setSelectedBooking] = useState([])
  const [branch, setBranch] = useState([])
  const [selectedBranch, setSelectedBranch] = useState({})

  const [alert, setAlert] = useState(false)
  const [alertContent, setAlertContent] = useState('')
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setAlert(false)
  }

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  useEffect(async () => {
    const sBooking = []
    await forEach(booking, element => {
      element.branch === selectedBranch.branch_id && sBooking.push(element)
    })
    setSelectedBooking([...sBooking])
  }, [selectedBranch, booking])

  useEffect(async () => {
    try {
      if (!branch.length) {
        let resBranch = await axios('/api/branch')
        resBranch = resBranch.data
        if (resBranch.is_success) {
          await forEach(resBranch.data, element => {
            setBranch(previousBranch => [...previousBranch, element])
          })
          const sBranch = resBranch.data.length ? resBranch.data[0] : ''
          setSelectedBranch(sBranch)

          if (!booking.length) {
            let resBooking = await axios('/api/booking')
            resBooking = resBooking.data
            if (resBooking.is_success) {
              await forEach(resBooking.data, element => {
                setBooking(previousBooking => [...previousBooking, element])
                if (element.branch_id === sBranch.branch_id) {
                  element.check_in = element.check_in.split('T')[0]
                  element.check_out = element.check_out.split('T')[0]
                  setSelectedBooking(previousBooking => [...previousBooking, element])
                }
              })
            } else {
              setAlert(true)
              setAlertContent(resBooking.data ? resBooking.data : 'Something Went Wrong!')
            }
          }
        } else {
          setAlert(true)
          setAlertContent(resBranch.data ? resBranch.data : 'Something Went Wrong!')
        }
      }
    } catch (err) {
      console.log(err)
      setAlert(true)
      setAlertContent('Something Went Wrong!')
    }
  }, [])

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value)
  }
  const columns = [
    { id: 'id', label: 'ID', minWidth: 150 },
    { id: 'room_number', label: 'Room Number', minWidth: 200 },
    { id: 'type_name', label: 'Room Type', minWidth: 200 },
    { id: 'check_in', label: 'Check In', minWidth: 200 },
    { id: 'check_out', label: 'Check Out', minWidth: 200 },
    { id: 'email', label: 'E-mail', minWidth: 200 }
  ]

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '10%' }} />
      <Grid container style={{ width: '100%', height: '100%' }}>
        <Menu />
        <Grid item xs={1} />
        <Grid item xs={8} style={{ height: '70vh' }}>
          <FormControl style={{ width: '210px', marginBottom: '10px' }}>
            <InputLabel id='input-branch-label'>Branch</InputLabel>
            <Select
              labelId='input-branch-label'
              id='input-branch'
              value={selectedBranch}
              label='Branch'
              onChange={handleBranchChange}
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
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedBooking
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
                        {columns.map((column) => {
                          const value = row[column.id]
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component='div'
            count={booking.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
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
