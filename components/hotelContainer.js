import { Paper, Grid, Typography, Accordion, AccordionSummary, AccordionDetails, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material'

export default function HotelContainer ({ name, location, detail, price }) {
  return (
    <Paper elevation={6} style={{ margin: '1%' }}>
      <Accordion>
        <AccordionSummary aria-controls='panel1a-content'>
          <Grid container>
            <Grid item xs={4} style={{ padding: '1%', aspectRatio: '1/1', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
              <img src='pic_test.jpg' style={{ objectFit: 'cover', width: '90%', height: '90%', borderRadius: '10%' }} />
            </Grid>
            <Grid item xs={8} style={{ padding: '1%', position: 'relative' }}>
              <Typography variant='h4' gutterBottom style={{ marginTop: '1%', marginBottom: '1%' }}>
                {name}
              </Typography>
              <Typography variant='h5' gutterBottom style={{ marginTop: '1%', marginBottom: '1%' }}>
                {location}
              </Typography>
              <Typography variant='h6' gutterBottom style={{ marginTop: '1%', marginBottom: '1%' }}>
                {detail}
              </Typography>
              <Typography variant='h6' gutterBottom style={{ position: 'absolute', bottom: '2.5%', right: '2.5%' }}>
                Price ${price}/night
              </Typography>

            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl component='fieldset' style={{ width: '100%' }}>
            <FormLabel component='legend'>Select Type</FormLabel>
            <RadioGroup
              aria-label='type'
              defaultValue='standard'
            >
              <FormControlLabel value='standard' control={<Radio />} label='Standard' style={{ width: '100%' }} />
              <Typography variant='body' gutterBottom>
                - Standard Detail Something
              </Typography>
              <FormControlLabel value='deluxe' control={<Radio />} label='Deluxe' style={{ width: '100%' }} />
              <Typography variant='body' gutterBottom>
                - Deluxe Detail Something
              </Typography>
              <FormControlLabel value='luxury' control={<Radio />} label='Luxury' style={{ width: '100%' }} />
              <Typography variant='body' gutterBottom>
                - Luxury Detail Something
              </Typography>
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>
    </Paper>
  )
}
