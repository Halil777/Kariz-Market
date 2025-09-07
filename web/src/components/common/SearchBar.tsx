import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const SearchBar: React.FC = () => {
  const { t } = useTranslation();
  const [q, setQ] = React.useState('');
  const navigate = useNavigate();
  const submit = (e: React.FormEvent) => { e.preventDefault(); navigate(`/search?q=${encodeURIComponent(q)}`); };
  return (
    <form onSubmit={submit}>
      <TextField size="small" fullWidth value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('common.search') as string}
        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>) }} />
    </form>
  );
};

