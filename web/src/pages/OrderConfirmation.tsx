import React from 'react';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams();
  return <Typography>Order {id} confirmed. Thank you!</Typography>;
};

