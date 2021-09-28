import { Paper, Grid, Skeleton } from '@mui/material'

export default function SkeletonHotelContainer () {
  return (
    <Paper elevation={6} style={{ margin: '1%' }}>
      <Grid container>
        <Grid item xs={4} style={{ padding: '1%', aspectRatio: '1/1', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
          <Skeleton animation='wave' style={{ width: '90%', height: '90%' }} />
        </Grid>
        <Grid item xs={8} style={{ padding: '1%', position: 'relative' }}>
          <Skeleton animation='wave' style={{ height: '12%', width: '70%' }} />
          <Skeleton animation='wave' style={{ height: '10%', width: '50%', marginBottom: '1%' }} />
          <Skeleton animation='wave' style={{ height: '8%', width: '85%' }} />
          <Skeleton animation='wave' style={{ height: '8%', width: '85%' }} />
          <Skeleton animation='wave' style={{ height: '8%', width: '90%' }} />
          <Skeleton animation='wave' style={{ height: '8%', width: '65%' }} />
          <Skeleton animation='wave' style={{ height: '8%', width: '45%' }} />
          <Skeleton animation='wave' style={{ position: 'absolute', bottom: '2.5%', right: '2.5%', height: '6%', width: '15%' }} />
        </Grid>
      </Grid>
    </Paper>
  )
}
