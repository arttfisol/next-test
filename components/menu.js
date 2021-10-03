import { Grid, List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import HomeIcon from '@mui/icons-material/Home'
import InboxIcon from '@mui/icons-material/Inbox'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'

export default function Menu ({ number, type, price }) {
  return (
    <Grid item xs={2} style={{ width: '100%', height: '100%' }}>
      <List component='nav' aria-label='main mailbox folders'>
        <Divider />
        <ListItemButton component='a' href='/home'>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary='Home' />
        </ListItemButton>
        <Divider />
        <Divider />
        <ListItemButton component='a' href='/admin/room'>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary='Room' />
        </ListItemButton>
        <Divider />
        <ListItemButton component='a' href='/admin/booking'>
          <ListItemIcon>
            <BookmarkAddIcon />
          </ListItemIcon>
          <ListItemText primary='Booking' />
        </ListItemButton>
        <Divider />
        <ListItemButton component='a'>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary='Dashboard' />
        </ListItemButton>
        <Divider />
        <ListItemButton component='a'>
          <ListItemIcon>
            <ManageAccountsIcon />
          </ListItemIcon>
          <ListItemText primary='Manage' />
        </ListItemButton>
      </List>
      <Divider />
    </Grid>
  )
}
