import { Grid, List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material'
import DraftsIcon from '@mui/icons-material/Drafts'
import InboxIcon from '@mui/icons-material/Inbox'

export default function Menu ({ number, type, price }) {
  return (
    <Grid item xs={2} style={{ width: '100%', height: '100%' }}>
      <List component='nav' aria-label='main mailbox folders'>
        <Divider />
        <ListItemButton component='a' href='/admin/room'>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary='Room' />
        </ListItemButton>
        <Divider />
        <ListItemButton component='a' href='/admin/book'>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary='Book' />
        </ListItemButton>
      </List>
      <Divider />
    </Grid>
  )
}
