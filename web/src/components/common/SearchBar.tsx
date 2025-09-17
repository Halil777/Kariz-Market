import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type Props = {
  size?: 'small' | 'medium';
  placeholder?: string;
  dense?: boolean;
};

export const SearchBar: React.FC<Props> = ({ size = 'small', placeholder, dense = true }) => {
  const { t } = useTranslation();
  const [q, setQ] = React.useState('');
  const navigate = useNavigate();
  const submit = (e: React.FormEvent) => { e.preventDefault(); navigate(`/search?q=${encodeURIComponent(q)}`); };
  return (
    <form onSubmit={submit}>
      <TextField
        size={size}
        fullWidth
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder || (t('common.search') as string)}
        InputProps={{
          sx: dense ? { '& .MuiInputBase-input': { py: 1.1 } } : undefined,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize={size === 'small' ? 'small' : 'medium'} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit" color="primary" size="small" aria-label="search">
                <SearchIcon fontSize={size === 'small' ? 'small' : 'medium'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
};
