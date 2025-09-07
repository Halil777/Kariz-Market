import React from 'react';
import { Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

export const SearchPage: React.FC = () => {
  const q = new URLSearchParams(useLocation().search).get('q') || '';
  return <Typography>Search results for "{q}"</Typography>;
};

