import React from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography } from '@mui/material';

const steps = ['Shipping', 'Payment', 'Confirmation'];

export const CheckoutPage: React.FC = () => {
  const [active, setActive] = React.useState(0);
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Checkout</Typography>
      <Stepper activeStep={active} sx={{ mb: 2 }}>
        {steps.map((label) => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}
      </Stepper>
      <Box sx={{ mb: 2 }}>Step {active + 1} form goes here...</Box>
      <Button variant="contained" onClick={() => setActive((s) => Math.min(s + 1, steps.length - 1))}>Next</Button>
    </Box>
  );
};

